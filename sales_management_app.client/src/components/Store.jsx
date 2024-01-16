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

function StoreContainer() {
    //use custom hook to handle CRUD operations
    const { add, update, remove, loading, error, setErrorState, setLoadingState } = useCRUDOperations('https://salesmanagementwebapp.azurewebsites.net/api/store');

    //state management for modals, store data, and current/new store details
    const [createModal, setCreateModal] = useState(false);
    const [editModal, setEditModal] = useState(false);
    const [deleteModal, setDeleteModal] = useState(false);
    const [stores, setStores] = useState([]);
    const [currentStore, setCurrentStore] = useState({name: "", address: ""});
    const [newStore, setNewStore] = useState({ name: "", address: "" });

    //use custom hook to handle sorting and pagination
    const {
        sortedData: sortedStores,
        currentPage,
        setCurrentPage,
        pageSize,
        setPageSize,
        sortColumn,
        sortDirection,
        handleSort } = useSortedPaginatedData(stores);

    // Fetch data on component mount or when pagination/sorting changes
    useEffect(() => {
        const fetchData = async () => {
            setLoadingState(true);
            setErrorState('');
            try {
                const response = await axios.get("https://localhost:7293/api/store");
                const { data } = response;
                setStores(data);
                setLoadingState(false);
            } catch (error) {
                setErrorState('There is no store data, Please create one.', error.message);
            }
        };
        fetchData();
    }, [currentPage, pageSize]);

    //to handle adding a new store
    const handleAddStore = async () => {
        add(newStore,
            (responseId) => {
                //update the new store to the stores array
                const addedStore = { ...newStore, id: responseId };
                setStores(prevStores => [...prevStores, addedStore]);
                setCreateModal(false);
            }
        );
    };

    //to handle updating a store
    const handleUpdateStore = async () => {
        update(newStore,
            () => {
                setStores(prevStores =>
                    prevStores.map(store =>
                        store.id === currentStore.id ? { ...store, ...newStore } : store
                    )
                );
                setEditModal(false);
                setNewStore({ name: "", address: "" });
            }
        );
    };

    //to handle deleting a store
    const handleDeleteStore = async () => {
        remove(currentStore.id,
            () => {
                setStores(prevStores => {
                    const updatedStores = prevStores.filter(store => store.id !== currentStore.id);

                    // if the last customer on the last page is deleted, go back to the previous page
                    const totalPages = Math.ceil(updatedStores.length / pageSize);
                    if (currentPage >= totalPages) {
                        // to avoid going to negative page numbers
                        setCurrentPage(totalPages > 0 ? totalPages - 1 : 0); 
                    }
                    return updatedStores;
                });
                setDeleteModal(false);
            }
        );
    };
    

    const openCreateModal = () => {
        setNewStore({ name: "", address: "" });
        setCreateModal(true);
    };

    const openEditModal = (store) => {
        setCurrentStore(store);
        setNewStore(store);
        setEditModal(true);
    };

    const openDeleteModal = (store) => {
        setCurrentStore(store);
        setNewStore(store);
        setDeleteModal(true);
    };

    const handleChange = (e, data) => {
        const { name, value } = data || e.target;
        setNewStore(prevState => ({
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
                            sorted={sortColumn === 'address' ? sortDirection : null}
                            onClick={() => handleSort('address')}>
                            Address
                        </Table.HeaderCell>
                        <Table.HeaderCell width={2} >Actions</Table.HeaderCell>
                        <Table.HeaderCell width={2} >Actions</Table.HeaderCell>
                    </Table.Row>
                </Table.Header>

                <Table.Body>
                    {sortedStores.map(store => (
                        <Table.Row key={store.id}>
                            <Table.Cell>{store.name}</Table.Cell>
                            <Table.Cell>{store.address}</Table.Cell>
                            <Table.Cell>
                                <Button color="yellow" icon='edit' content='Edit' onClick={() => openEditModal(store) } />
                            </Table.Cell>
                            <Table.Cell>
                                <Button icon="trash" content="Delete" onClick={() => openDeleteModal(store)} negative />
                            </Table.Cell>
                        </Table.Row>
                    ))}
                </Table.Body>

                <TableFooter>
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
                                {Array.from({ length: Math.ceil(stores.length / pageSize) }, (_, index) => (
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
                </TableFooter>
            </Table>

            {/* Create Modal */}
            <Modal
                onClose={() => setCreateModal(false)}
                onOpen={() => setCreateModal(true)}
                open={createModal}>
                <ModalHeader>Create store</ModalHeader>
                <ModalContent>
                    <Form>
                        <Form.Input
                            fluid
                            label='NAME'
                            placeholder='Name'
                            name='name'
                            value={newStore.name}
                            onChange={handleChange}
                        />
                        <Form.Input
                            fluid
                            label='ADDRESS'
                            placeholder='Address'
                            name='address'
                            value={newStore.address}
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
                        onClick={() => handleAddStore()}
                        positive
                        disabled={newStore.name === "" || newStore.address === ""} />
                </ModalActions>
            </Modal>

            {/* Edit Modal */}
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
                            value={newStore.name}
                            onChange={handleChange} />
                        <Form.Input
                            fluid
                            label='ADDRESS'
                            placeholder='Address'
                            name='address'
                            value={newStore.address}
                            onChange={handleChange} />
                    </Form>
                </ModalContent>
                <ModalActions>
                    <Button content="Cancel" color='black' onClick={() => setEditModal(false)} />
                    <Button
                        content="Edit"
                        labelPosition='right'
                        icon='checkmark'
                        onClick={() => handleUpdateStore()}
                        positive
                        disabled={newStore.name === "" || newStore.address === ""} />
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
                        onClick={() => handleDeleteStore()}
                        negative />
                </ModalActions>
            </Modal>
        </>
    )

}

export default StoreContainer;