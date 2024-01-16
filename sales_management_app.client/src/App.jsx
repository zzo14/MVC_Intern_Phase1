import './App.css';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import NavBar from './components/navBar';
import Customer from './components/Customer';
import Product from './components/Product';
import Sales from './components/Sales';
import Store from './components/Store';
import Home from './components/Home';
import 'semantic-ui-css/semantic.min.css'

const App = () => {
    return (
        <Router>
            <NavBar />
            <Routes>
                <Route path='/' element={<Home />} />
                <Route path='/customers' element={<Customer />} />
                <Route path='/products' element={<Product />} />
                <Route path='/stores' element={<Store />} />
                <Route path='/sales' element={<Sales />} />
            </Routes>
        </Router>
    );
};

export default App;



