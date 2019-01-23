import React, { Component } from 'react';
import './TextForm.css';

class TextForm extends Component {

  _handleChange = value => {
    this.props.onChange(this.props.name, value);
  };

  _handleTouch = () => {
    this.props.onBlur(this.props.name);
  }

  render() {
    const { label, error, ...rest } = this.props;
    return (
      <div className="TextForm">
        <div className="form-group">
          <label>{label}</label>
          <input
          type={label==='Password' ? "password" : "text" }
          className="form-control"
          placeholder={label}
          onChange={this._handleChange}
          onBlur={this._handleTouch}
        {...rest} />
          {error}
        </div>
      </div>
    );
  }
}

export default TextForm;