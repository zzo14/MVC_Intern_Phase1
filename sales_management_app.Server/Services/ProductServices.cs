using Microsoft.EntityFrameworkCore;
using sale_management_app.Models;
using sales_management_app.Server.Model;
using sales_management_app.Server.ViewModel;
using AutoMapper;

namespace sales_management_app.Server.Services
{
    public class ProductServices : IProductServices
    {
        private readonly SalesDBContext _context;
        private readonly IMapper _mapper;

        public ProductServices(SalesDBContext context, IMapper mapper)
        {
            _context = context;
            _mapper = mapper;
        }

        public async Task<List<productViewModel>> GetProducts()
        {
            var products = await _context.Products.ToListAsync();
            return _mapper.Map<List<productViewModel>>(products);
        }

        public async Task<List<productViewModel>> GetProducts(int? id)
        {
            var products = await _context.Products.Where(p => p.Id == id).ToListAsync();
            return _mapper.Map<List<productViewModel>>(products);
        }

        public async Task<Boolean> updateProductAsync(productViewModel model)
        {
            var productToUpdate = await _context.Products.FindAsync(model.Id);

            if (productToUpdate != null)
            {
                productToUpdate.Name = model.Name;
                productToUpdate.Price = model.Price;

                _context.Products.Update(productToUpdate);
                var results = await _context.SaveChangesAsync();
                if (results > 0)
                {
                    return true;
                }
            }
            return false;
        }

        public async Task<Boolean> deleteProduct(int id)
        {
            var product = await _context.Products.FindAsync(id);
            if (product == null)
            {
                return false;
            }
            _context.Products.Remove(product);
            var results = await _context.SaveChangesAsync();
            if (results > 0)
            {
                return true;
            }
            return false;
        }

        public async Task<int> createProduct(createProductViewModel model)
        {
            var product = new Product
            {
                Name = model.Name,
                Price = model.Price,
            };
            _context.Products.Add(product);
            await _context.SaveChangesAsync();
            return product.Id;
        }
    }
}
