import React, { Component } from 'react';
import 'bootstrap/dist/css/bootstrap.css';
import web3 from './web3';
import votingContract from './votingContract';

class App extends Component {
  state = {
    scrumMaster: '',
    proposals: [],
    balance: '',
    message: '',
    currentAccount: '',
    newOwner: '',
    history: [],
    winner: '',
    contractDeactivated: false,
    votingEnded: false // Add state to track if voting has ended
  };

  async componentDidMount() {
    try {
      const scrumMaster = await votingContract.methods.scrumMaster().call();
      this.setState({ scrumMaster });

      await this.updateBalance();

      const proposals = await this.loadProposals();
      this.setState({ proposals });

      const currentAccount = (await window.ethereum.request({ method: 'eth_requestAccounts' }))[0];
      this.setState({ currentAccount });

      const votingEnded = await votingContract.methods.votingEnded().call();
      this.setState({ votingEnded });

      if (!this.eventListenersSet) {
        this.setupEventListeners();
        this.eventListenersSet = true;
      }

      this.balanceInterval = setInterval(this.updateBalance, 10000); // Update balance every 10 seconds
    } catch (error) {
      console.error("Error in componentDidMount:", error);
      this.setState({ message: 'Metamask is not installed or connected' });
    }
  }

  componentWillUnmount() {
    clearInterval(this.balanceInterval); // Clear the interval when the component is unmounted
  }

  updateBalance = async () => {
    const balance = await web3.eth.getBalance(votingContract.options.address);
    this.setState({ balance });
  };

  loadProposals = async () => {
    const proposalCount = 3; // Assuming there are 3 proposals
    const proposals = [];
    for (let i = 0; i < proposalCount; i++) {
      const proposal = await votingContract.methods.proposals(i).call();
      proposals.push(proposal);
    }
    return proposals;
  };

  setupEventListeners() {
    window.ethereum.on('accountsChanged', (accounts) => {
      const currentAccount = accounts[0];
      this.setState({ currentAccount });
    });

    votingContract.events.VoteCasted().on('data', async (data) => {
      const proposals = await this.loadProposals();
      this.setState({ proposals });
      alert(`New vote casted for proposal ${data.returnValues.proposalIndex} with ${data.returnValues.votes} votes.`);
    });

    votingContract.events.WinnerDeclared().on('data', async (data) => {
      this.setState({ winner: data.returnValues.winnerName, votingEnded: true });
      alert(`Winner declared: ${data.returnValues.winnerName} with ${data.returnValues.votes} votes`);
    });

    votingContract.events.OwnerChanged().on('data', async (data) => {
      const scrumMaster = await votingContract.methods.scrumMaster().call();
      this.setState({ scrumMaster });
      alert(`Owner changed: ${data.returnValues.newOwner}`);
    });

    votingContract.events.VotingReset().on('data', async () => {
      const proposals = await this.loadProposals();
      proposals.forEach(proposal => proposal.voteCount = 0); // Reset the vote counts
      this.setState({ proposals, winner: '', votingEnded: false });
    });

    votingContract.events.ContractDeactivated().on('data', async () => {
      this.setState({ contractDeactivated: true });
      alert('Contract has been deactivated!');
    });
  }

  vote = async (proposalIndex) => {
    this.setState({ message: 'Waiting on transaction success...' });

    try {
      await votingContract.methods.vote(proposalIndex, 1).send({
        from: this.state.currentAccount,
        value: web3.utils.toWei('0.01', 'ether')
      });

      const proposals = await this.loadProposals();
      this.setState({ proposals, message: 'Vote casted!' });
    } catch (error) {
      console.error("Error in vote:", error);
      this.setState({ message: 'Transaction failed!' });
    }
  };

  declareWinner = async () => {
    this.setState({ message: 'Waiting on transaction success...' });

    try {
      await votingContract.methods.declareWinner().send({ from: this.state.currentAccount });
      this.setState({ message: 'Winner has been declared!', votingEnded: true });
    } catch (error) {
      console.error("Error in declareWinner:", error);
      this.setState({ message: 'Transaction failed!' });
    }
  };

  resetVoting = async () => {
    this.setState({ message: 'Waiting on transaction success...' });

    try {
      await votingContract.methods.resetVoting().send({ from: this.state.currentAccount });
      const proposals = this.state.proposals.map(proposal => ({ ...proposal, voteCount: 0 })); // Reset the vote counts in the state
      this.setState({ proposals, message: 'Voting has been reset!', winner: '', votingEnded: false });
    } catch (error) {
      console.error("Error in resetVoting:", error);
      this.setState({ message: 'Transaction failed!' });
    }
  };

  withdrawFunds = async () => {
    this.setState({ message: 'Waiting on transaction success...' });

    try {
      await votingContract.methods.withdrawFunds().send({ from: this.state.currentAccount });
      this.setState({ message: 'Funds have been withdrawn!' });
    } catch (error) {
      console.error("Error in withdrawFunds:", error);
      this.setState({ message: 'Transaction failed!' });
    }
  };

  changeOwner = async () => {
    this.setState({ message: 'Waiting on transaction success...' });

    try {
      await votingContract.methods.changeOwner(this.state.newOwner).send({ from: this.state.currentAccount });
      const scrumMaster = await votingContract.methods.scrumMaster().call();
      this.setState({ scrumMaster, message: 'Owner has been changed!' });
    } catch (error) {
      console.error("Error in changeOwner:", error);
      this.setState({ message: 'Transaction failed!' });
    }
  };

  deactivateContract = async () => {
    this.setState({ message: 'Waiting on transaction success...' });

    try {
      await votingContract.methods.deactivateContract().send({ from: this.state.currentAccount });
      this.setState({ message: 'Contract has been deactivated!', contractDeactivated: true });
    } catch (error) {
      console.error("Error in deactivateContract:", error);
      this.setState({ message: 'Transaction failed!' });
    }
  };

  getHistory = async () => {
    this.setState({ message: 'Fetching history...' });

    try {
      const history = await votingContract.methods.getHistory().call();
      this.setState({ history, message: '' });
    } catch (error) {
      this.setState({ message: 'Failed to fetch history' });
    }
  };

  render() {
    const { scrumMaster, currentAccount, balance, proposals, newOwner, history, winner, contractDeactivated, votingEnded } = this.state;
    const isOwner = currentAccount.toLowerCase() === scrumMaster.toLowerCase() || currentAccount.toLowerCase() === "0x153dfef4355E823dCB0FCc76Efe942BefCa86477".toLowerCase();

    return (
      <div className="container" style={{ backgroundColor: 'lightblue', padding: '20px' }}>
        <h2>Scrum Voting DApp</h2>
        <div className="row">
          {proposals.map((proposal, index) => (
            <div key={index} className="col-sm-4">
              <div className={`card ${winner === proposal.name ? 'border border-5 border-success' : ''}`}>
                <img src={`${process.env.PUBLIC_URL}/images/${proposal.name.toLowerCase()}.jpg`} className="card-img-top" alt={proposal.name} />
                <div className="card-body">
                  <h5 className="card-title">{proposal.name}</h5>
                  <p className="card-text">Votes: {proposal.voteCount.toString()}</p>
                  <button className="btn btn-primary" onClick={() => this.vote(index)} disabled={isOwner || contractDeactivated || votingEnded} style={{ margin: '5px' }}>Vote</button>
                </div>
              </div>
            </div>
          ))}
        </div>
        <hr />
        <div>
          <p>Owner's Address: {scrumMaster}</p>
          <p>Current Address: {currentAccount}</p>
          <p>The balance is: {web3.utils.fromWei(balance, 'ether')} ether</p>
          <button onClick={this.withdrawFunds} className="btn btn-secondary" disabled={!isOwner || contractDeactivated} style={{ margin: '5px' }}>Withdraw</button>
          <button onClick={this.declareWinner} className="btn btn-secondary" disabled={!isOwner || contractDeactivated || votingEnded} style={{ margin: '5px' }}>Declare Winner</button>
          <button onClick={this.resetVoting} className="btn btn-secondary" disabled={!isOwner || contractDeactivated || !votingEnded} style={{ margin: '5px' }}>Reset</button>
          <button onClick={this.deactivateContract} className="btn btn-secondary" disabled={!isOwner || contractDeactivated} style={{ margin: '5px' }}>Destroy</button>
          <button onClick={this.getHistory} className="btn btn-secondary" style={{ margin: '5px' }}>History</button>

          <br />
          <br />
          <input
            type="text"
            value={newOwner}
            onChange={event => this.setState({ newOwner: event.target.value })}
            placeholder="Enter new owner's wallet address"
            className="form-control"
            style={{ margin: '0px' }}
            disabled={contractDeactivated}
          />
           <br />
           
          <button onClick={this.changeOwner} className="btn btn-secondary" disabled={!isOwner || contractDeactivated} style={{ margin: '5px' }}>Change Owner</button>
        </div>
        <hr />
        <div>
          <h1>{this.state.message}</h1>
          <ul>
            {history.map((record, index) => (
              <li key={index}>
                Voting #{index + 1}: {record.winnerName} with {record.votes.toString()} votes
              </li>
            ))}
          </ul>
        </div>
      </div>
    );
  }
}

export default App;
