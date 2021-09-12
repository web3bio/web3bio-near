import React, { Component } from 'react'
import IconWebsite from '../assets/icons/website.svg'
import IconEmail from '../assets/icons/email.svg'
import IconTwitter from '../assets/icons/twitter.svg'
import IconFacebook from '../assets/icons/facebook.svg'
import IconLinkedin from '../assets/icons/linkedin.svg'
import IconGithub from '../assets/icons/github.svg'
import IconTelegram from '../assets/icons/telegram.svg'
import IconInstagram from '../assets/icons/instagram.svg'
import IconYoutube from '../assets/icons/youtube.svg'
import IconDiscord from '../assets/icons/discord.svg'
import IconPaypal from '../assets/icons/paypal.svg'
import IconPatreon from '../assets/icons/patreon.svg'

class SocialLinks extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    const { social } = this.props

    return (
      <div className="profile-social">
        {social.website? 
          <a href={social.website} target="_blank" rel="noopener noreferrer" className="profile-social-item website">
            <img src={IconWebsite} className="profile-social-icon icon" alt="Website" />
          </a> : null
        }
        {social.email? 
          <a href={`mailto:${social.email}`} target="_blank" rel="noopener noreferrer" className="profile-social-item email">
            <img src={IconEmail} className="profile-social-icon icon" alt="Email" />
          </a> : null
        }
        {social.twitter? 
          <a href={social.twitter} target="_blank" rel="noopener noreferrer" className="profile-social-item twitter">
            <img src={IconTwitter} className="profile-social-icon icon" alt="Twitter" />
          </a> : null
        }
        {social.facebook? 
          <a href={social.facebook} target="_blank" rel="noopener noreferrer" className="profile-social-item facebook">
            <img src={IconFacebook} className="profile-social-icon icon" alt="Facebook" />
          </a> : null
        }
        {social.linkedin? 
          <a href={social.linkedin} target="_blank" rel="noopener noreferrer" className="profile-social-item linkedin">
            <img src={IconLinkedin} className="profile-social-icon icon" alt="LinkedIn" />
          </a> : null
        }
        {social.github? 
          <a href={social.github} target="_blank" rel="noopener noreferrer" className="profile-social-item github">
            <img src={IconGithub} className="profile-social-icon icon" alt="GitHub" />
          </a> : null
        }
        {social.telegram? 
          <a href={social.telegram} target="_blank" rel="noopener noreferrer" className="profile-social-item telegram">
            <img src={IconTelegram} className="profile-social-icon icon" alt="Telegram" />
          </a> : null
        }
        {social.instagram? 
          <a href={social.instagram} target="_blank" rel="noopener noreferrer" className="profile-social-item instagram">
            <img src={IconInstagram} className="profile-social-icon icon" alt="Instagram" />
          </a> : null
        }
        {social.youtube? 
          <a href={social.youtube} target="_blank" rel="noopener noreferrer" className="profile-social-item youtube">
            <img src={IconYoutube} className="profile-social-icon icon" alt="YouTube" />
          </a> : null
        }
        {social.discord? 
          <a href={social.discord} target="_blank" rel="noopener noreferrer" className="profile-social-item discord">
            <img src={IconDiscord} className="profile-social-icon icon" alt="Discord" />
          </a> : null
        }
        {social.paypal? 
          <a href={social.paypal} target="_blank" rel="noopener noreferrer" className="profile-social-item paypal">
            <img src={IconPaypal} className="profile-social-icon icon" alt="PayPal" />
          </a> : null
        }
        {social.patreon? 
          <a href={social.patreon} target="_blank" rel="noopener noreferrer" className="profile-social-item patreon">
            <img src={IconPatreon} className="profile-social-icon icon" alt="Patreon" />
          </a> : null
        }
      </div>
    )
  }

}

export default SocialLinks;
