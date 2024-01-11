using sales_management_app.Server.ViewModel;

namespace sales_management_app.Server.Services
{
    public interface IStoreServices
    {
        Task<List<storeViewModel>> GetStores();
        Task<List<storeViewModel>> GetStores(int? id);
        Task<Boolean> updateStoreAsync(storeViewModel store);
        Task<Boolean> deleteStore(int id);
        Task<int> createStore(createStoreViewModel store);
    }
}
