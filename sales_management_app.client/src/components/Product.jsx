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


function ProductContainer() {
    //use custom hook to handle CRUD operations
    const { add, update, remove, loading, error, setErrorState, setLoadingState } = useCRUDOperations('https://localhost:7293/api/product');

    //state management for modals, product data, and current/new product details
    const [createModal, setCreateModal] = useState(false);
    const [editModal, setEditModal] = useState(false);
    const [deleteModal, setDeleteModal] = useState(false);
    const [products, setProducts] = useState([]);
    const [currentProduct, setCurrentProduct] = useState({ name: "", price: 0.00 });
    const [newProduct, setNewProduct] = useState({ name: "", price: 0.00 });

    //use custom hook to handle sorting and pagination
    const {
        sortedData: sortedProducts,
        currentPage,
        setCurrentPage,
        pageSize,
        setPageSize,
        sortColumn,
        sortDirection,
        handleSort } = useSortedPaginatedData(products);

    //fetch product data from API
    useEffect(() => {
        const fetchData = async () => {
            setLoadingState(true);
            setErrorState('');
            try {
                const response = await axios.get("https://localhost:7293/api/product");
                const { data } = response;
                setProducts(data);
                setLoadingState(false);
            } catch (error) {
                setErrorState('There is no product data, Please create one.', error.message);
            }
        };
        fetchData();
    }, [currentPage, pageSize]);

    const handleAddProduct = async () => {
        add(newProduct,
            (responseId) => {
                const addedProduct = { ...newProduct, id: responseId };
                setProducts(prevProducts => [...prevProducts, addedProduct]);
                setCreateModal(false);
            }
        );
    };

    const handleUpdateProduct = async () => {
        update(newProduct,
            () => {
                setProducts(prevProducts =>
                    prevProducts.map(product =>
                        product.id === currentProduct.id ? { ...product, ...newProduct } : product
                    )
                );
                setEditModal(false);
                setNewProduct({ name: "", price: 0.00 });
            }
        );
    };

    const handleDeleteProduct = async () => {
        remove(currentProduct.id,
            () => {
                setProducts(prevProducts => {
                    const updatedProducts = prevProducts.filter(product => product.id !== currentProduct.id)

                    // if the last customer on the last page is deleted, go back to the previous page
                    const totalPages = Math.ceil(updatedProducts.length / pageSize)
                    if (currentPage >= totalPages) {
                        // to avoid going to negative page numbers
                        setCurrentPage(totalPages > 0 ? totalPages - 1 : 0); 
                    }
                    return updatedProducts;
                }
                );
                setDeleteModal(false);
            }
        );
    };

    const openCreateModal = () => {
        setNewProduct({ name: "", price: 0.00 });
        setCreateModal(true);
    };

    const openEditModal = (product) => {
        setCurrentProduct(product);
        setNewProduct(product);
        setEditModal(true);
    };

    const openDeleteModal = (product) => {
        setCurrentProduct(product);
        setNewProduct(product);
        setDeleteModal(true);
    };

    //handle input changes
    const handleChange = (e, data) => {
        const { name, value: rawValue } = data || e.target;
        let value = rawValue;
        if (name === 'price') {
            // remove leading zeros but allow for leading zero if value is between 0 and 1
            if (value && value.startsWith('0') && !value.startsWith('0.')) {
                value = value.replace(/^0+/, '');
            }
            // disable negative number
            if (!value.includes('.') && value !== '') {
                const numericValue = parseFloat(value);
                value = numericValue >= 0 ? numericValue : 0;
            }
        }
        setNewProduct(prevState => ({
            ...prevState, [name]: value
        }));
    };

    //format currency for table display
    const formatCurrency = (value) => {
        return new Intl.NumberFormat('en-NZ', { style: 'currency', currency: 'NZD' }).format(value);
    };

    return (
        <>
            {loading && <div>Loading...</div>}
            {error && <div style={{ color: 'red' }}>{error}</div>}
            <Button color='blue' content='New Product' style={{ marginTop: '10px', marginLeft: '20px', marginBottom: '10px' }} onClick={() => openCreateModal()} />

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
                            sorted={sortColumn === 'price' ? sortDirection : null}
                            onClick={() => handleSort('price')}>
                            Price
                        </Table.HeaderCell>
                        <Table.HeaderCell width={2} >Actions</Table.HeaderCell>
                        <Table.HeaderCell width={2} >Actions</Table.HeaderCell>
                    </Table.Row>
                </Table.Header>

                <Table.Body>
                    {sortedProducts.map(product => (
                        <Table.Row key={product.id}>
                            <Table.Cell>{product.name}</Table.Cell>
                            <Table.Cell>{formatCurrency(product.price)}</Table.Cell>
                            <Table.Cell>
                                <Button color="yellow" icon='edit' content='Edit' onClick={() => openEditModal(product)} />
                            </Table.Cell>
                            <Table.Cell>
                                <Button icon="trash" content="Delete" onClick={() => openDeleteModal(product)} negative />
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
                                {Array.from({ length: Math.ceil(products.length / pageSize) }, (_, index) => (
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
                <ModalHeader>Create product</ModalHeader>
                <ModalContent>
                    <Form>
                        <Form.Input
                            fluid
                            label='NAME'
                            placeholder='Name'
                            name='name'
                            value={newProduct.name}
                            onChange={handleChange}/>
                        <Form.Input
                            icon='dollar sign'
                            iconPosition='left'
                            fluid
                            label='PRICE'
                            placeholder='Price'
                            name='price'
                            value={newProduct.price}
                            onChange={handleChange}
                            type='text'/>
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
                        onClick={() => handleAddProduct()}
                        positive
                        disabled={newProduct.name === "" || newProduct.price === ""}
                    />
                </ModalActions>
            </Modal>

            {/* Edit Modal */}
            <Modal
                onClose={() => setEditModal(false)}
                onOpen={() => setEditModal(true)}
                open={editModal}>
                <ModalHeader>Edit product</ModalHeader>
                <ModalContent>
                    <Form>
                        <Form.Input
                            fluid
                            label='NAME'
                            placeholder='Name'
                            name='name'
                            value={newProduct.name}
                            onChange={handleChange}/>
                        <Form.Input
                            icon='dollar sign'
                            iconPosition='left'
                            fluid
                            label='PRICE'
                            placeholder='Price'
                            name='price'
                            value={newProduct.price}
                            onChange={handleChange}
                            type='text'/>
                    </Form>
                </ModalContent>
                <ModalActions>
                    <Button content="Cancel" color='black' onClick={() => setEditModal(false)} />
                    <Button
                        content="Edit"
                        labelPosition='right'
                        icon='checkmark'
                        onClick={() => handleUpdateProduct()}
                        positive
                        disabled={newProduct.name === "" || newProduct.price === ""} />
                </ModalActions>
            </Modal>

            {/* Delete Confirmation Modal */}
            <Modal
                onClose={() => setDeleteModal(false)}
                onOpen={() => setDeleteModal(true)}
                open={deleteModal}>
                <ModalHeader>Delete product</ModalHeader>
                <ModalContent>
                    <h4>Are you sure?</h4>
                </ModalContent>
                <ModalActions>
                    <Button content="Cancel" color='black' onClick={() => setDeleteModal(false)} />
                    <Button
                        content="Delete"
                        labelPosition='right'
                        icon='delete'
                        onClick={() => handleDeleteProduct()}
                        negative />
                </ModalActions>
            </Modal>

        </>
    )
}

export default ProductContainer;