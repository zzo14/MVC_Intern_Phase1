using Microsoft.EntityFrameworkCore;
using sale_management_app.Models;
using sales_management_app.Server.Model;
using sales_management_app.Server.ViewModel;
using AutoMapper;
using System.Net;

namespace sales_management_app.Server.Services
{
    public class StoreServices : IStoreServices
    {
        private readonly IMapper _mapper;
        private readonly SalesDBContext _context;

        public StoreServices(IMapper mapper, SalesDBContext context)
        {
            _mapper = mapper;
            _context = context;
        }

        public async Task<List<storeViewModel>> GetStores()
        {
            var stores = await _context.Stores.ToListAsync();
            return _mapper.Map<List<storeViewModel>>(stores);
        }

        public async Task<List<storeViewModel>> GetStores(int? id)
        {
            var stores = await _context.Stores.Where(s => s.Id == id).ToListAsync();
            return _mapper.Map<List<storeViewModel>>(stores);
        }

        public async Task<Boolean> updateStoreAsync(storeViewModel model)
        {
            var storeToUpdate = await _context.Stores.FindAsync(model.Id);

            if (storeToUpdate != null)
            {
                storeToUpdate.Name = model.Name;
                storeToUpdate.Address = model.Address;

                _context.Stores.Update(storeToUpdate);
                var results = await _context.SaveChangesAsync();
                if (results > 0)
                {
                    return true;
                }
            }
            return false;
        }

        public async Task<Boolean> deleteStore(int id)
        {
            var store = await _context.Stores.FindAsync(id);
            if (store == null)
            {
                return false;
            }
            _context.Stores.Remove(store);
            var result = await _context.SaveChangesAsync();
            if (result > 0)
            {
                return true;
            }
            return false;
        }

        public async Task<int> createStore(createStoreViewModel model)
        {
            var store = new Store
            {
                Name = model.Name,
                Address = model.Address,
            };
            _context.Stores.Add(store);
            await _context.SaveChangesAsync();
            return store.Id;
        }
    }
}
