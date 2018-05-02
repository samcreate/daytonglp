import PropTypes from 'prop-types';
import React, { Component } from 'react';
import classNames from 'classnames';

const propTypes = {
    player: PropTypes.object,
    className: PropTypes.string,
};

export default class SettingsButton extends Component {

    constructor(props, context) {
        super(props, context);
        this.handleClick = this.handleClick.bind(this);
        this.on = false;
        this.state = {
            french: false,
            english: true,
            show: false
        }
    }

    handleClick(e) {
        e.preventDefault();
       if(this.on){
           this.refs.SettingsButton.style.opacity = 0.3;
           this.on = false;
           this.setState({ show: false });
       } else {
           this.refs.SettingsButton.style.opacity = 1;
           this.on = true;
           this.setState({show: true});
           
       }
        
    }

    changeLang(lang, e){
        e.preventDefault();
        if (lang === 'en'){
            this.setState({ english: true, french: false });
        } else {
            this.setState({ english: false, french: true });
        }
        this.props.parent.setLanguage(lang);
    }

    render() {
        const { player, className } = this.props;
        const { currentSrc } = player;

        return (
            <div>
                <ul ref="SettingsButtonMenu" className={this.state.show ? 'sbmenu' : 'sbhide sbmenu'} >
                    <li><a href="" onClick={this.changeLang.bind(this, 'en')} className={this.state.english ? 'default c-glyph context-glyph-tile' : ''} >English</a></li>
                    <li><a href="" onClick={this.changeLang.bind(this, 'fr')} className={this.state.french ? 'default c-glyph context-glyph-tile' : ''}  >French</a></li>
                </ul>
                <a
                    ref='SettingsButton'
                    className={classNames(className, {
                        'video-react-control': true,
                        'video-react-button': true,
                    })}
                    href={currentSrc}
                    download
                    style={{
                        backgroundImage: "url('data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAABO0lEQVQ4jYWTOy9EURRG14wZgkQjGZXCWyNB5ZUodLppiEKnFbXaT5hEohOVQqUlWo1CjwgSCZEI8RazFHMnzhxzWclN9rf3/vY55557MyoRHcASMAgsJrkS8AasA+c13Wr4zKnP/jCt9gS6rK6Enly0+jXQEug94DPQGeAxNFQHFIEn4DIx5JN8PoirnAATQC+wlVHbgIek+A40Jiul8Qo0J/FADlgNik1/GKs0B/FaFuhMaTwChoA+YDelp1B9mzPqnbV0RTd0H9Te1XmVbDLpAviKppf/0AJXlUhL1udQ7VYL6mZKz04OaE053xhwBnxQuZl6tGfUAnCT0vAfIzngFlgGXoBTYJ/fH09IMdlRP3Ac/wv9KWcNmQ092Wj6eKQXgKkoN1qjoh1k1WF1Qz0I8jvqtjqpNoSeb+wtQlvV3VEtAAAAAElFTkSuQmCC')",
                        backgroundRepeat: 'no-repeat',
                        backgroundPosition: 'center'
                    }}
                    tabIndex="0"
                    onClick={this.handleClick.bind(this)}
                >Video Settings</a>
            </div>
        );
    }
}

SettingsButton.propTypes = propTypes;

