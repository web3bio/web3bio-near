import 'regenerator-runtime/runtime'
import React, { Component } from 'react'
import { ethers } from 'ethers'

class ProfileENS extends Component {
  constructor(props) {
    super(props);
    this.state = {
      login: false,
      currentUser: window.accountId,
      loading: true,
      pageBio: new Object(),
      pageStatus: false
    }
  }

  async componentDidMount() {
    const pageOwner = this.props.match.params.owner + '.eth'
    let newRecords = new Object()
    
    const provider = new ethers.providers.JsonRpcProvider("https://mainnet.infura.io/v3/7f86ba0450d4494e9e25e5c2c6ff145c")
    const ensAvatarUrl = await provider.getAvatar(pageOwner)
    console.log(ensAvatarUrl)
    
    // this.getEthersResolver(pageOwner).then((resolver) => {
    //   let newRecords = {
    //     location: resolver.getText("location").then(function(result) {
    //       return result;
    //     }),
    //     theme: resolver.getText("theme"),
    //     email: resolver.getText("email"),
    //     website: resolver.getText("url"),
    //     twitter: resolver.getText("com.twitter"),
    //     facebook: resolver.getText("com.facebook"),
    //     linkedin: resolver.getText("com.linkedin"),
    //     github: resolver.getText("com.github"),
    //     gitcoin: resolver.getText("co.gitcoin"),
    //     medium: resolver.getText("com.medium"),
    //     wechat: resolver.getText("wechat"),
    //     telegram: resolver.getText("org.telegram"),
    //     instagram: resolver.getText("com.instagram"),
    //     youtube: resolver.getText("com.youtube"),
    //     discord: resolver.getText("com.discord"),
    //     eth: resolver.getAddress()
    //   }
    //   console.log(newRecords)
    // }).catch(e => console.log(e));
  }


  render() {
    const { pageBio } = this.state

    return (
      <>
        <div className="web3bio-content container grid-lg">
          <div className="web3bio-profile text-center">
            <h2 className="profile-name">{pageBio.displayname}</h2>
            <h3>ENS</h3>
            <img src={ensAvatarUrl} alt="avatar" className="profile-avatar" />
          </div>
        </div>
      </>
    )
  }
}

export default ProfileENS;
