using sales_management_app.Server.ViewModel;

namespace sales_management_app.Server.Services
{
    public interface IProductServices
    {
        Task<List<productViewModel>> GetProducts();
        Task<List<productViewModel>> GetProducts(int? id);
        Task<Boolean> updateProductAsync(productViewModel product);
        Task<Boolean> deleteProduct(int id);
        Task<int> createProduct(createProductViewModel product);
    }
}
