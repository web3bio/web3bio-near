import React, { Component } from 'react'
import SVG from 'react-inlinesvg'
import IconWebsite from '../assets/icons/social-website.svg'
import IconEmail from '../assets/icons/social-email.svg'
import IconTwitter from '../assets/icons/social-twitter.svg'
import IconFacebook from '../assets/icons/social-facebook.svg'
import IconLinkedin from '../assets/icons/social-linkedin.svg'
import IconGithub from '../assets/icons/social-github.svg'
import IconGitcoin from '../assets/icons/social-gitcoin.svg'
import IconMeidum from '../assets/icons/social-medium.svg'
import IconTelegram from '../assets/icons/social-telegram.svg'
import IconInstagram from '../assets/icons/social-instagram.svg'
import IconYoutube from '../assets/icons/social-youtube.svg'
import IconDiscord from '../assets/icons/social-discord.svg'
import IconReddit from '../assets/icons/social-reddit.svg'
import IconPatreon from '../assets/icons/social-patreon.svg'
import IconPaypal from '../assets/icons/social-paypal.svg'

class SocialLinks extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    const { social } = this.props

    return (
      <div className="profile-social profile-widget">
        {social.website? 
          <a href={social.website} target="_blank" rel="noopener noreferrer" className="profile-social-item tooltip website" title="Website">
            <SVG src={IconWebsite} className="profile-social-icon icon" alt="Website" />
          </a> : null
        }
        {social.email? 
          <a href={`mailto:${social.email}`} target="_blank" rel="noopener noreferrer" className="profile-social-item tooltip email" title="Email">
            <SVG src={IconEmail} className="profile-social-icon icon" alt="Email" />
          </a> : null
        }
        {social.twitter? 
          <a href={social.twitter} target="_blank" rel="noopener noreferrer" className="profile-social-item tooltip twitter" title="Twitter">
            <SVG src={IconTwitter} className="profile-social-icon icon" alt="Twitter" />
          </a> : null
        }
        {social.facebook? 
          <a href={social.facebook} target="_blank" rel="noopener noreferrer" className="profile-social-item tooltip facebook" title="Facebook">
            <SVG src={IconFacebook} className="profile-social-icon icon" alt="Facebook" />
          </a> : null
        }
        {social.linkedin? 
          <a href={social.linkedin} target="_blank" rel="noopener noreferrer" className="profile-social-item tooltip linkedin" title="LinkedIn">
            <SVG src={IconLinkedin} className="profile-social-icon icon" alt="LinkedIn" />
          </a> : null
        }
        {social.github? 
          <a href={social.github} target="_blank" rel="noopener noreferrer" className="profile-social-item tooltip github" title="GitHub">
            <SVG src={IconGithub} className="profile-social-icon icon" alt="GitHub" />
          </a> : null
        }
        {social.gitcoin? 
          <a href={social.gitcoin} target="_blank" rel="noopener noreferrer" className="profile-social-item tooltip gitcoin" title="Gitcoin">
            <SVG src={IconGitcoin} className="profile-social-icon icon" alt="Gitcoin" />
          </a> : null
        }
        {social.medium? 
          <a href={social.medium} target="_blank" rel="noopener noreferrer" className="profile-social-item tooltip medium" title="Medium">
            <SVG src={IconMeidum} className="profile-social-icon icon" alt="Medium" />
          </a> : null
        }
        {social.telegram? 
          <a href={social.telegram} target="_blank" rel="noopener noreferrer" className="profile-social-item tooltip telegram" title="Telegram">
            <SVG src={IconTelegram} className="profile-social-icon icon" alt="Telegram" />
          </a> : null
        }
        {social.instagram? 
          <a href={social.instagram} target="_blank" rel="noopener noreferrer" className="profile-social-item tooltip instagram" title="Instagram">
            <SVG src={IconInstagram} className="profile-social-icon icon" alt="Instagram" />
          </a> : null
        }
        {social.youtube? 
          <a href={social.youtube} target="_blank" rel="noopener noreferrer" className="profile-social-item tooltip youtube" title="YouTube">
            <SVG src={IconYoutube} className="profile-social-icon icon" alt="YouTube" />
          </a> : null
        }
        {social.discord? 
          <a href={social.discord} target="_blank" rel="noopener noreferrer" className="profile-social-item tooltip discord" title="Discord">
            <SVG src={IconDiscord} className="profile-social-icon icon" alt="Discord" />
          </a> : null
        }
        {social.reddit? 
          <a href={social.reddit} target="_blank" rel="noopener noreferrer" className="profile-social-item tooltip reddit" title="Reddit">
            <SVG src={IconReddit} className="profile-social-icon icon" alt="Reddit" />
          </a> : null
        }
        {social.patreon? 
          <a href={social.patreon} target="_blank" rel="noopener noreferrer" className="profile-social-item tooltip patreon" title="Patreon">
            <SVG src={IconPatreon} className="profile-social-icon icon" alt="Patreon" />
          </a> : null
        }
        {social.paypal? 
          <a href={social.paypal} target="_blank" rel="noopener noreferrer" className="profile-social-item tooltip paypal" title="PayPal">
            <SVG src={IconPaypal} className="profile-social-icon icon" alt="PayPal" />
          </a> : null
        }
      </div>
    )
  }

}

export default SocialLinks;
