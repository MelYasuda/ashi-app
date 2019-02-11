import React, { Component } from 'react';
import './TextForm.css';
import PropTypes from 'prop-types';

class TextForm extends Component {

  _handleChange = value => {
    this.props.onChange(this.props.name, value);
  };

  _handleTouch = () => {
    this.props.onBlur(this.props.name);
  }

  render() {
    const { label, error, placeHolder, title, ...rest } = this.props;
    return (
        <div className="form-group">
          <label>
          {title}
          <input
          type={(label==='Password'|| label==='Confirm Password') ? "password" : "text" }
          className="form-control"
          placeholder={label==='UserName'?placeHolder:label}
          onChange={this._handleChange}
          onBlur={this._handleTouch}
        {...rest} />
          {error}
          </label>
        </div>
    );
  }
}

TextForm.prototTypes ={
  onChange: PropTypes.func,
  name: PropTypes.string,
}

export default TextForm;