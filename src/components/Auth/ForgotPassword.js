import React, { Component } from 'react';
import './Auth.css';

class ForgotPassword extends Component {
  render() {
    return (
      <div className="Auth">
        <form>
          <input type="text" className="form-control" placeholder="Enter an address,or city" />
          <button type="submit" class="btn btn-primary">Search</button>
        </form>
      </div>
    );
  }
}

export default ForgotPassword;