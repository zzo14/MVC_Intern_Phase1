/* eslint-disable react/jsx-key */
/* eslint-disable react/prop-types */
import { useEffect, useState } from "react";
import axios from "axios";
import useSortedPaginatedData from "../hooks/useSortedPaginatedData";
import useCRUDOperations from "../hooks/useCRUDOperations";
import {
    ModalHeader,
    ModalContent,
    ModalActions,
    Modal,
    Button,
    Table,
    TableFooter,
    TableHeaderCell,
    TableRow,
    MenuItem,
    Menu,
    Form
} from "semantic-ui-react";

function CustomerContainer() {
    const azureApiUrl = 'https://salesmanagementwebapp.azurewebsites.net/api/customer';

    //use custom hook to handle CRUD operations
    const { add, update, remove, loading, error, setErrorState, setLoadingState } = useCRUDOperations(azureApiUrl);

    //state management for modals, customers data, and current/new customer details
    const [createModal, setCreateModal] = useState(false);
    const [editModal, setEditModal] = useState(false);
    const [deleteModal, setDeleteModal] = useState(false);
    const [customers, setCustomers] = useState([]);
    const [currentCustomer, setCurrentCustomer] = useState({name: "",address: "" });
    const [newCustomer, setNewCustomer] = useState({ name: "", address: "" });

    //use custom hook to handle sorting and pagination
    const {
        sortedData: sortedCustomers,
        currentPage,
        setCurrentPage,
        pageSize,
        setPageSize,
        sortColumn,
        sortDirection,
        handleSort} = useSortedPaginatedData(customers);

    // Fetch customer data on component mount or when pagination/sorting changes
    useEffect(() => {
        const fetchData = async () => {
            setLoadingState(true);
            setErrorState('');
            try {
                const response = await axios.get(azureApiUrl);
                const { data } = response;
                setCustomers(data);
                setLoadingState(false);
            } catch (error) {
                setErrorState('There is no customer data, Please create one.', error.message);
            }
        };
        fetchData();
    }, [currentPage, pageSize]);

    //function to handle adding a new customer
    const handleAddCustomer = async () => {
        add(newCustomer,
            (responseId) => {
                //update the new customer to the customers array
                const addedCustomer = { ...newCustomer, id: responseId };
                setCustomers(prevCustomers => [...prevCustomers, addedCustomer]);
                setCreateModal(false);
            }
        );
    };

    //function to handle updating a customer, same as adding a new customer but with a different callback
    const handleUpdateCustomer = async () => {
        update(newCustomer,
            () => {
                setCustomers(prevCustomers =>
                    prevCustomers.map(customer =>
                        customer.id === currentCustomer.id ? { ...customer, ...newCustomer } : customer
                    )
                );
                setEditModal(false);
                setNewCustomer({ name: "", address: "" });
            }
        );
    };

    //function to handle deleting a customer, same as adding a new customer but with a different callback
    const handleDeleteCustomer = async () => {
        remove(currentCustomer.id,
            () => {
                setCustomers(prevCustomers => {
                    const updatedCustomers = prevCustomers.filter(customer => customer.id !== currentCustomer.id)
                    // if the last customer on the last page is deleted, go back to the previous page
                    const totalPages = Math.ceil(updatedCustomers.length / pageSize);
                    if (currentPage >= totalPages) {
                        // to avoid going to negative page numbers
                        setCurrentPage(totalPages > 0 ? totalPages - 1 : 0); 
                    }
                    return updatedCustomers;
                });
                setDeleteModal(false);
            }
        );
    };

    //to open modals and set the new customer details
    const openCreateModal = () => {
        setNewCustomer({ name: "", address: "" });
        setCreateModal(true);
    };

    //to open edit modal and set the current/new customer details
    const openEditModal = (customer) => {
        setCurrentCustomer(customer);
        setNewCustomer(customer);
        setEditModal(true);
    };

    //to open delete modal and set the current/new customer details
    const openDeleteModal = (customer) => {
        setCurrentCustomer(customer);
        setNewCustomer(customer);
        setDeleteModal(true);
    };

    //handle change in input fields
    const handleChange = (e, data) => {
        const { name, value } = data || e.target;
        setNewCustomer(prevState => ({
            ...prevState, [name]: value
        }));
    };

    return (
        <>
            {loading && <div>Loading...</div>}
            {error && <div style={{ color: 'red' }}>{error}</div>}
            <Button color='blue' content='New Customers' style={{ marginTop: '10px', marginLeft: '20px', marginBottom: '10px' }} onClick={() => openCreateModal()} />
            <Table celled padded selectable sortable style={{ maxWidth: '95%', margin: 'auto' }}>
                <Table.Header>
                    <Table.Row>
                        <Table.HeaderCell
                            width={4}
                            sorted={sortColumn === 'name' ? sortDirection : null}
                            onClick={() => handleSort('name')}>
                            Name
                        </Table.HeaderCell>
                        <Table.HeaderCell
                            sorted={sortColumn === 'address' ? sortDirection: null }
                            onClick={() => handleSort('address')}>
                            Address
                        </Table.HeaderCell>
                        <Table.HeaderCell width={2} >Actions</Table.HeaderCell>
                        <Table.HeaderCell width={2} >Actions</Table.HeaderCell>
                    </Table.Row>
                </Table.Header>

                <Table.Body>
                    {sortedCustomers.length > 0 ? (
                        sortedCustomers.map(customer => (
                            <Table.Row key={customer.id}>
                                <Table.Cell>{customer.name}</Table.Cell>
                                <Table.Cell>{customer.address}</Table.Cell>
                                <Table.Cell>
                                    <Button color="yellow" icon='edit' content='Edit' onClick={() => openEditModal(customer)} />
                                </Table.Cell>
                                <Table.Cell>
                                    <Button icon="trash" content="Delete" onClick={() => openDeleteModal(customer)} negative />
                                </Table.Cell>
                            </Table.Row>
                        ))
                    ) : (
                        <Table.Row>
                            <Table.Cell colSpan="4">No customer data, please create one.</Table.Cell>
                        </Table.Row>
                    )}
                </Table.Body>

                {sortedCustomers.length > 0 && (< TableFooter >
                    <TableRow>
                        <TableHeaderCell>
                            <Menu floated='left'>
                                <Menu.Item>
                                    <select
                                        value={pageSize}
                                        onChange={(e) => setPageSize(Number(e.target.value))}>
                                        {[10, 20, 30, 40, 50].map(size => (
                                            <option key={size} value={size}>
                                                {size}
                                            </option>
                                        ))}
                                    </select>
                                </Menu.Item>
                            </Menu>
                        </TableHeaderCell>
                        <TableHeaderCell colSpan='4'>
                            <Menu floated='right' pagination>
                                {Array.from({ length: Math.ceil(customers.length / pageSize) }, (_, index) => (
                                    <MenuItem
                                        as='a'
                                        key={index}
                                        active={currentPage === index}
                                        onClick={() => setCurrentPage(index)}>
                                        {index + 1}
                                    </MenuItem>
                                ))}
                            </Menu>
                        </TableHeaderCell>
                    </TableRow>
                </TableFooter>)}
            </Table>

            {/* Create Customer Modal */}
            <Modal
                onClose={() => setCreateModal(false)}
                onOpen={() => setCreateModal(true)}
                open={createModal}>
                <ModalHeader>Create customer</ModalHeader>
                <ModalContent>
                    <Form>
                        <Form.Input
                            fluid
                            label='NAME'
                            placeholder='Name'
                            name='name'
                            value={newCustomer.name}
                            onChange={handleChange}
                        />
                        <Form.Input
                            fluid
                            label='ADDRESS'
                            placeholder='Address'
                            name='address'
                            value={newCustomer.address}
                            onChange={handleChange}
                        />
                    </Form>
                </ModalContent>
                <ModalActions>
                    <Button color='black' onClick={() => setCreateModal(false)}>
                        Cancel
                    </Button>
                    <Button
                        content="Create"
                        labelPosition='right'
                        icon='checkmark'
                        onClick={() => handleAddCustomer()}
                        positive
                        disabled={newCustomer.name === "" || newCustomer.address === ""}/>
                </ModalActions>
            </Modal>

            {/* Edit Customer Modal */}
            <Modal
                onClose={() => setEditModal(false)}
                onOpen={() => setEditModal(true)}
                open={editModal}>
                <ModalHeader>Edit customer</ModalHeader>
                <ModalContent>
                    <Form>
                        <Form.Input
                            fluid
                            label='NAME'
                            placeholder='Name'
                            name='name'
                            value={newCustomer.name}
                            onChange={handleChange}/>
                        <Form.Input
                            fluid
                            label='ADDRESS'
                            placeholder='Address'
                            name='address'
                            value={newCustomer.address}
                            onChange={handleChange}/>
                    </Form>
                </ModalContent>
                <ModalActions>
                    <Button content="Cancel" color='black' onClick={() => setEditModal(false)} />
                    <Button
                        content="Edit"
                        labelPosition='right'
                        icon='checkmark'
                        onClick={() => handleUpdateCustomer()}
                        positive
                        disabled={newCustomer.name === "" || newCustomer.address === ""}/>
                </ModalActions>
            </Modal>

            {/* Delete Confirmation Modal */}
            <Modal
                onClose={() => setDeleteModal(false)}
                onOpen={() => setDeleteModal(true)}
                open={deleteModal}>
                <ModalHeader>Delete customer</ModalHeader>
                <ModalContent>
                    <h4>Are you sure?</h4>
                </ModalContent>
                <ModalActions>
                    <Button content="Cancel" color='black' onClick={() => setDeleteModal(false)} />
                    <Button
                        content="Delete"
                        labelPosition='right'
                        icon='delete'
                        onClick={() => handleDeleteCustomer()}
                        negative/>
                </ModalActions>
            </Modal>
        </>
    )
}

export default CustomerContainer;