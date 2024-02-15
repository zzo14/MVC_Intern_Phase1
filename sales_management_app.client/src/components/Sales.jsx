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
    Form,
    FormSelect
} from "semantic-ui-react";

function SalesContainer() {
    const salesAzureApiUrl = 'https://onboardingsalesmanagementapi.azurewebsites.net/api/sales';
    const productAzureApiUrl = 'https://onboardingsalesmanagementapi.azurewebsites.net/api/product';
    const customerAzureApiUrl = 'https://onboardingsalesmanagementapi.azurewebsites.net/api/customer';
    const storeAzureApiUrl = 'https://onboardingsalesmanagementapi.azurewebsites.net/api/store';

    //use custom hook to handle CRUD operations
    const { add, update, remove, loading, error, setErrorState, setLoadingState } = useCRUDOperations(salesAzureApiUrl);

    //state management for modals, data, and current/new sale details
    const [createModal, setCreateModal] = useState(false);
    const [editModal, setEditModal] = useState(false);
    const [deleteModal, setDeleteModal] = useState(false);
    const [sales, setSales] = useState([]);
    const [customers, setCustomers] = useState([]);
    const [products, setProducts] = useState([]);
    const [stores, setStores] = useState([]);

    const [currentSale, setCurrentSale] = useState({
        customerId: null,
        productId: null,
        storeId: null,
        dateSold: "",
        customer: "",
        product: "",
        store: ""
    });
    const [newSale, setNewSale] = useState({
        customerId: null,
        productId: null,
        storeId: null,
        dateSold: "",
        customer: "",
        product: "",
        store: ""
    });

    const {
        sortedData: sortedSales,
        currentPage,
        setCurrentPage,
        pageSize,
        setPageSize,
        sortColumn,
        sortDirection,
        handleSort } = useSortedPaginatedData(sales);

    //fetch data from api
    useEffect(() => {
        const fetchData = async () => {
            setLoadingState(true);
            setErrorState('');
            try {
                const [customersResponse, productsResponse, storesResponse] = await Promise.all([
                    axios.get(customerAzureApiUrl),
                    axios.get(productAzureApiUrl),
                    axios.get(storeAzureApiUrl),
                ]);

                const customersData = customersResponse.data;
                const productsData = productsResponse.data;
                const storesData = storesResponse.data;

                setCustomers(customersData)
                setProducts(productsData)
                setStores(storesData)

                const response = await axios.get(salesAzureApiUrl);
                const salesData = response.data;

                //map sales data to include customer, product, and store names
                const updatedData = salesData.map(sale => {
                    const customer = customersData.find(c => c.id === sale.customerId);
                    const product = productsData.find(p => p.id === sale.productId);
                    const store = storesData.find(s => s.id === sale.storeId);
                    return {
                        ...sale,
                        customer: customer ? customer.name : 'Unknown',
                        product: product ? product.name : 'Unknown',
                        store: store ? store.name : 'Unknown',
                    };
                });
                setSales(updatedData);
                setLoadingState(false);
            } catch (error) {
                setErrorState('There is no sales data, Please create one.', error.message);
            }
        };
        fetchData();
    }, [currentPage, pageSize]);

    const handleAddSale = async () => {
        const dateFormattedSale = formatDateSale(newSale);
        add(dateFormattedSale,
            (responseId) => {
                //get customer, product, and store names from options, and add them to new sale
                const customerName = customerOptions.find(option => option.value === newSale.customerId)?.text || 'Unknown Customer';
                const productName = productOptions.find(option => option.value === newSale.productId)?.text || 'Unknown Product';
                const storeName = storeOptions.find(option => option.value === newSale.storeId)?.text || 'Unknown Store';
                const addedSale = {
                    ...newSale,
                    id: responseId,
                    customer: customerName,
                    product: productName,
                    store: storeName
                };
                setSales(prevSales => [...prevSales, addedSale]);
                setCreateModal(false);
            }
        );
    };

    const handleUpdateSale = async () => {
        console.log(newSale);
        update(newSale,
            () => {
                const customerName = customerOptions.find(option => option.value === newSale.customerId)?.text || 'Unknown Customer';
                const productName = productOptions.find(option => option.value === newSale.productId)?.text || 'Unknown Product';
                const storeName = storeOptions.find(option => option.value === newSale.storeId)?.text || 'Unknown Store';
                const updatedSale = {
                    ...newSale,
                    customer: customerName,
                    product: productName,
                    store: storeName
                };
                setSales(prevSales =>
                    prevSales.map(sale =>
                        sale.id === currentSale.id ? { ...sale, ...updatedSale } : sale
                    )
                );
                setEditModal(false);
                setNewSale({
                    customerId: null,
                    productId: null,
                    storeId: null,
                    dateSold: formatDateToNZT(new Date()),
                    customer: "",
                    product: "",
                    store: ""
                });
            }
        );
    };

    const handleDeleteSale = async () => {
        remove(currentSale.id,
            () => {
                setSales(prevSales => {
                    const undatedSales = prevSales.filter(sale => sale.id !== currentSale.id);

                    // if the last customer on the last page is deleted, go back to the previous page
                    const totalPages = Math.ceil(undatedSales.length / pageSize);
                    if (currentPage >= totalPages) {
                        // to avoid going to negative page numbers
                        setCurrentPage(totalPages > 0 ? totalPages - 1 : 0); 
                    }
                    return undatedSales;
                });
                setDeleteModal(false);
            }
        );
    };

    const openCreateModal = () => {
        setNewSale({
            customerId: null,
            productId: null,
            storeId: null,
            dateSold: formatDateToNZT(new Date()),
            customer: "",
            product: "",
            store: ""
        });
        setCreateModal(true);
    };

    const openEditModal = (sale) => {
        setCurrentSale(sale);

        // format the date to NZT
        const formattedDateSold = formatDateToNZT(sale.dateSold);
        const dateFormatedSale = {
            ...sale,
            dateSold: formattedDateSold,
        };
        setNewSale(dateFormatedSale);
        setEditModal(true);
    };

    const openDeleteModal = (sale) => {
        setCurrentSale(sale);
        setNewSale(sale);
        setDeleteModal(true);
    };

    const handleChange = (e, data) => {
        const { name, value } = data || e.target;
        setNewSale(prevState => ({
            ...prevState, [name]: value
        }));
    };

    // map customer, product, and store data to options for dropdown menu
    const customerOptions = customers.map((customer, index) => ({
        key: index,
        text: customer.name,
        value: customer.id
    }))
    const productOptions = products.map((product, index) => ({
        key: index,
        text: product.name,
        value: product.id
    }))
    const storeOptions = stores.map((store, index) => ({
        key: index,
        text: store.name,
        value: store.id
    }))

    //format Date data for Table display, eg. 11 Jan 2024
    const formatDateForTable = (time) => {
        const date = new Date(time);
        return new Intl.DateTimeFormat('en-GB', { dateStyle: 'medium', timeZone: 'Pacific/Auckland', }).format(date)
    };

    //format Date data TO NZT for html datePicker to , eg. 2024-01-11
    const formatDateToNZT = (dateString) => {
        const date = new Date(dateString);
        // format the date to NZT
        const nztDateString = new Intl.DateTimeFormat('en-NZ', {
            timeZone: 'Pacific/Auckland',
            year: 'numeric',
            month: '2-digit',
            day: '2-digit',
        }).format(date);
        // change the date format to YYYY-MM-DD
        const [day, month, year] = nztDateString.split('/');
        const formattedDate = `${year}-${month}-${day}`;
        return formattedDate;
    };

    //format Date data for API, eg. 2024-01-11T00:00:00
    const formatDateSale = (saleData) => {
        const dateString = saleData.dateSold;
        const formattedDate = formatDateToNZT(dateString);
        const dateFormatedSale = {
            ...saleData,
            dateSold: formattedDate,
        };
        setNewSale(dateFormatedSale);
        return newSale;
    };

    return (
        <>
            {loading && <div>Loading...</div>}
            {error && <div style={{ color: 'red' }}>{error}</div>}
            <Button color='blue' content='New Sale' style={{ marginTop: '10px', marginLeft: '20px', marginBottom: '10px' }} onClick={() => openCreateModal()} />
            <Table celled padded selectable sortable style={{ maxWidth: '95%', margin: 'auto' }}>
                <Table.Header>
                    <Table.Row>
                        <Table.HeaderCell
                            width={4}
                            sorted={sortColumn === 'customer' ? sortDirection : null}
                            onClick={() => handleSort('customer')}>
                            Customer
                        </Table.HeaderCell>
                        <Table.HeaderCell
                            sorted={sortColumn === 'product' ? sortDirection : null}
                            onClick={() => handleSort('product')}>
                            Product
                        </Table.HeaderCell>
                        <Table.HeaderCell
                            sorted={sortColumn === 'store' ? sortDirection : null}
                            onClick={() => handleSort('store')}>
                            Store
                        </Table.HeaderCell>
                        <Table.HeaderCell
                            sorted={sortColumn === 'dateSold' ? sortDirection : null}
                            onClick={() => handleSort('dateSold')}>
                            Date Sold
                        </Table.HeaderCell>
                        <Table.HeaderCell width={2} >Actions</Table.HeaderCell>
                        <Table.HeaderCell width={2} >Actions</Table.HeaderCell>
                    </Table.Row>
                </Table.Header>

                <Table.Body>
                    {sortedSales.length > 0 ? (
                        sortedSales.map(sale => (
                            <Table.Row key={sale.id}>
                                <Table.Cell>{sale.customer}</Table.Cell>
                                <Table.Cell>{sale.product}</Table.Cell>
                                <Table.Cell>{sale.store}</Table.Cell>
                                <Table.Cell>{formatDateForTable(sale.dateSold)}</Table.Cell>
                                <Table.Cell>
                                    <Button color="yellow" icon='edit' content='Edit' onClick={() => openEditModal(sale)} />
                                </Table.Cell>
                                <Table.Cell>
                                    <Button icon="trash" content="Delete" negative onClick={() => openDeleteModal(sale)} />
                                </Table.Cell>
                            </Table.Row>
                        ))
                    ) : (
                        <Table.Row>
                            <Table.Cell colSpan="4">No sale data, please create one.</Table.Cell>
                        </Table.Row>
                    )}
                </Table.Body>

                {sortedSales.length > 0 && (
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
                            <TableHeaderCell colSpan='5'>
                                <Menu floated='right' pagination>
                                    {Array.from({ length: Math.ceil(sales.length / pageSize) }, (_, index) => (
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

            {/* Create Modal */}
            <Modal
                onClose={() => setCreateModal(false)}
                onOpen={() => setCreateModal(true)}
                open={createModal}>
                <ModalHeader>Create sale</ModalHeader>
                <ModalContent>
                    <Form>
                        <Form.Field>
                            <label>Date sold</label>
                            <input
                                type="date"
                                name='dateSold'
                                value={newSale.dateSold}
                                onChange={handleChange}
                                max={formatDateToNZT(new Date())}
                                style={{ width: '25%' }}/>
                        </Form.Field>
                        <FormSelect
                            fluid
                            label='Customer'
                            options={customerOptions}
                            placeholder='Select a customer'
                            name='customerId'
                            value={newSale.customerId}
                            onChange={handleChange}
                        />
                        <FormSelect
                            fluid
                            label='Product'
                            options={productOptions}
                            placeholder='Select a product'
                            name='productId'
                            value={newSale.productId}
                            onChange={handleChange}
                        />
                        <FormSelect
                            fluid
                            label='Store'
                            options={storeOptions}
                            placeholder='Select a store'
                            name='storeId'
                            value={newSale.storeId}
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
                        onClick={() => handleAddSale()}
                        positive
                        disabled={newSale.productId === null || newSale.customerId === null || newSale.storeId === null}
                    />
                </ModalActions>
            </Modal>

            {/* Edit Modal */}
            <Modal
                onClose={() => setEditModal(false)}
                onOpen={() => setEditModal(true)}
                open={editModal}>
                <ModalHeader>Edit sale</ModalHeader>
                <ModalContent>
                    <Form>
                        <Form.Field>
                            <label>Date sold</label>
                            <input
                                type="date"
                                name='dateSold'
                                value={newSale.dateSold}
                                onChange={handleChange}
                                max = {new Date().toISOString().split('T')[0]}
                                style={{ width: '25%' }} />
                        </Form.Field>
                        <FormSelect
                            fluid
                            label='Customer'
                            options={customerOptions}
                            placeholder='Select a customer'
                            name='customerId'
                            value={newSale.customerId}
                            onChange={handleChange}
                        />
                        <FormSelect
                            fluid
                            label='Product'
                            options={productOptions}
                            placeholder='Select a product'
                            name='productId'
                            value={newSale.productId}
                            onChange={handleChange}
                        />
                        <FormSelect
                            fluid
                            label='Store'
                            options={storeOptions}
                            placeholder='Select a store'
                            name='storeId'
                            value={newSale.storeId}
                            onChange={handleChange}
                        />
                    </Form>
                </ModalContent>
                <ModalActions>
                    <Button color='black' onClick={() => setEditModal(false)}>
                        Cancel
                    </Button>
                    <Button
                        content="Create"
                        labelPosition='right'
                        icon='checkmark'
                        onClick={() => handleUpdateSale()}
                        positive
                        disabled={newSale.productId === null || newSale.customerId === null || newSale.storeId === null}
                    />
                </ModalActions>
            </Modal>

            {/* Delete Confirmation Modal */}
            <Modal
                onClose={() => setDeleteModal(false)}
                onOpen={() => setDeleteModal(true)}
                open={deleteModal}>
                <ModalHeader>Delete sale</ModalHeader>
                <ModalContent>
                    <h4>Are you sure?</h4>
                </ModalContent>
                <ModalActions>
                    <Button content="Cancel" color='black' onClick={() => setDeleteModal(false)} />
                    <Button
                        content="Delete"
                        labelPosition='right'
                        icon='delete'
                        onClick={() => handleDeleteSale()}
                        negative />
                </ModalActions>
            </Modal>
        </>
    )
}

export default SalesContainer;