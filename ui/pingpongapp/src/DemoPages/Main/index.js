import React, {Fragment,useState, useEffect}  from 'react';
import {connect} from 'react-redux';
import cx from 'classnames';
import {withRouter} from 'react-router-dom';

import ResizeDetector from 'react-resize-detector';

import AppMain from '../../Layout/AppMain';
import { PingPongClient } from './proto/service_grpc_web_pb';
import { PingRequest } from './proto/service_pb';

  // We create a client that connects to the api
var client = new PingPongClient("https://130.185.78.233:8080");

export function App() {
  // Create a const named status and a function called setStatus
  const [status, setStatus] = useState(false);
  // sendPing is a function that will send a ping to the backend
  const sendPing = () => {
    var pingRequest = new PingRequest();
    // use the client to send our pingrequest, the function that is passed
    // as the third param is a callback.
    client.ping(pingRequest, null, function(err, response) {
      // serialize the response to an object
      var pong = response.toObject();
      // call setStatus to change the value of status
       setStatus(pong.ok);
    });
  }

  useEffect(() => {
    // Start a interval each 3 seconds which calls sendPing.
    const interval = setInterval(() => sendPing(), 3000)
    return () => {
      // reset timer
      clearInterval(interval);
    }
  },[status]);

  // we will return the HTML. Since status is a bool
  // we need to + '' to convert it into a string
  return (
    <div className="App">
      <p>Status: {status + ''}</p>
    </div>
  );


}

class Main extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            closedSmallerSidebar: false
        };

    }

    render() {
        let {
            colorScheme,
            enableFixedHeader,
            enableFixedSidebar,
            enableFixedFooter,
            enableClosedSidebar,
            closedSmallerSidebar,
            enableMobileMenu,
            enablePageTabsAlt,
        } = this.props;

        return (
            <ResizeDetector
                handleWidth
                render={({ width }) => (
                    <Fragment>
                        <div className={cx(
                            "app-container app-theme-" + colorScheme,
                            {'fixed-header': enableFixedHeader},
                            {'fixed-sidebar': enableFixedSidebar || width < 1250},
                            {'fixed-footer': enableFixedFooter},
                            {'closed-sidebar': enableClosedSidebar || width < 1250},
                            {'closed-sidebar-mobile': closedSmallerSidebar || width < 1250},
                            {'sidebar-mobile-open': enableMobileMenu},
                        )}>
                            <AppMain/>
                        </div>
                    </Fragment>
                )}
            />
        )
    }
}

const mapStateToProp = state => ({
    colorScheme: state.ThemeOptions.colorScheme,
    enableFixedHeader: state.ThemeOptions.enableFixedHeader,
    enableMobileMenu: state.ThemeOptions.enableMobileMenu,
    enableFixedFooter: state.ThemeOptions.enableFixedFooter,
    enableFixedSidebar: state.ThemeOptions.enableFixedSidebar,
    enableClosedSidebar: state.ThemeOptions.enableClosedSidebar,
    enablePageTabsAlt: state.ThemeOptions.enablePageTabsAlt,

});
//p
//p
//export default  App;
export default  withRouter(connect(mapStateToProp)(Main));

