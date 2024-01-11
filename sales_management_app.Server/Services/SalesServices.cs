using Microsoft.EntityFrameworkCore;
using sale_management_app.Models;
using sales_management_app.Server.Model;
using sales_management_app.Server.ViewModel;
using AutoMapper;

namespace sales_management_app.Server.Services
{
    public class SalesServices : ISalesServices
    {
        private readonly SalesDBContext _context;
        private readonly IMapper _mapper;

        public SalesServices(SalesDBContext context, IMapper mapper)
        {
            _context = context;
            _mapper = mapper;
        }

        public async Task<List<salesViewModel>> GetSales()
        {
            var sales = await _context.Sales.ToListAsync();
            return _mapper.Map<List<salesViewModel>>(sales);
        }

        public async Task<Boolean> updateSaleAsync(salesViewModel model)
        {
            var saleToUpdate = await _context.Sales.FindAsync(model.Id);
            var productExists = await _context.Products.AnyAsync(p => p.Id == model.ProductId);
            var customerExists = await _context.Customers.AnyAsync(c => c.Id == model.CustomerId);
            var storeExists = await _context.Stores.AnyAsync(s => s.Id == model.StoreId);

            if (saleToUpdate != null && productExists && customerExists && storeExists)
            {
                saleToUpdate.CustomerId = model.CustomerId;
                saleToUpdate.ProductId = model.ProductId;
                saleToUpdate.StoreId = model.StoreId;
                saleToUpdate.DateSold = model.DateSold;

                _context.Sales.Update(saleToUpdate);
                var results = await _context.SaveChangesAsync();
                if (results > 0)
                {
                    return true;
                }
            }
            return false;
        }

        public async Task<Boolean> deleteSale(int id)
        {
            var sale = await _context.Sales.FindAsync(id);
            if (sale == null)
            {
                return false;
            }
            _context.Sales.Remove(sale);
            var results = await _context.SaveChangesAsync();
            if (results > 0)
            {
                return true;
            }
            return false;
        }

        public async Task<int> createSale(createSalesViewModel model)
        {
            var sale = new Sales
            {
                CustomerId = model.CustomerId,
                ProductId = model.ProductId,
                StoreId = model.StoreId,
                DateSold = model.DateSold,
            };

            var productExists = await _context.Products.AnyAsync(p => p.Id == model.ProductId);
            var customerExists = await _context.Customers.AnyAsync(c => c.Id == model.CustomerId);
            var storeExists = await _context.Stores.AnyAsync(s => s.Id == model.StoreId);

            if (!productExists || !customerExists || !storeExists)
            {
                return 0;
            }

            _context.Sales.Add(sale);
            var results = await _context.SaveChangesAsync();
            if (results > 0)
            {
                return sale.Id;
            }
            return 0;
        }

    }
}
