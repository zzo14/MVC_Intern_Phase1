
import { Menu } from 'semantic-ui-react';
import { NavLink } from 'react-router-dom';
import './NavBar.css';

const NavBar = () => {
    return (
        <Menu inverted className="custom-navbar">
            <Menu.Item as={NavLink} to='/' name='React' />
            <Menu.Item as={NavLink} to='/customers' name='Customers' />
            <Menu.Item as={NavLink} to='/products' name='Products' />
            <Menu.Item as={NavLink} to='/stores' name='Stores' />
            <Menu.Item as={NavLink} to='/sales' name='Sales' />
        </Menu>
    );
};

export default NavBar;
