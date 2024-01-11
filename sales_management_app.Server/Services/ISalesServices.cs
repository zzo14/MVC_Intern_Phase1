using sales_management_app.Server.ViewModel;

namespace sales_management_app.Server.Services
{
    public interface ISalesServices
    {
        Task<List<salesViewModel>> GetSales();
        Task<Boolean> updateSaleAsync(salesViewModel sale);
        Task<Boolean> deleteSale(int id);
        Task<int> createSale(createSalesViewModel sale);
    }
}
