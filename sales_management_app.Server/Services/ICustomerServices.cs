using sales_management_app.Server.Model;
using sales_management_app.Server.ViewModel;

namespace sales_management_app.Server.Services
{
    public interface ICustomerServices
    {
        Task<List<customerViewModel>> GetCustomers();
        Task<List<customerViewModel>> GetCustomers(int? id);
        Task<Boolean> updateCustomerAsync(customerViewModel customer);
        Task<Boolean> deleteCustomer(int id);
        Task<int> createCustomer(createCustomerViewModel customer);
    }
}
