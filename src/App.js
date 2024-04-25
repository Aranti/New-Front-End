// import logo from './logo.svg';
import * as React from "react";
import 'bootstrap/dist/css/bootstrap.min.css';
import { BrowserRouter, HashRouter } from 'react-router-dom';
// import '../public/CommonCss/style.css';
// import Registration from './Components/RegistrationComponent';
// import Login from './Components/LoginComponent';
import Main from './Components/MainComponent';
import { Provider } from 'react-redux';
import { ConfigureStore } from './redux/configureStore';
// import vesselParticulars from './models/vesselParticulars.json';

const store = ConfigureStore();

function App() {
  console.log(window.innerHeight)

  return (
    <Provider store={store}>
      <HashRouter>
        <Main />
      </HashRouter>
    </Provider>
    // <Router>
    //   <Switch>
    //     <Route path="/login" exact={true}>
    //         <Login />
    //     </Route>
    //     <Route path="/register" exact={true}>
    //         <Registration />
    //     </Route>
    //     <Route path="/daily" exact={true}>
    //         <DailyComponent vesselParticulars={vesselParticulars} />
    //     </Route>
    //     <Route path="/interactive" exact={true}>
    //         <Interactive  />
    //     </Route>
    //     <Route path="/trends" exact={true}>
    //         <Trends  />
    //     </Route>
    //   </Switch>
    // </Router>
    // <div>Hello world!</div>
  );
}

export default App;
