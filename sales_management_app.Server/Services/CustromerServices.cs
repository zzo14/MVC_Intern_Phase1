using Microsoft.EntityFrameworkCore;
using sale_management_app.Models;
using sales_management_app.Server.Model;
using sales_management_app.Server.ViewModel;
using AutoMapper;
using System.Net;

namespace sales_management_app.Server.Services
{
    public class CustromerServices : ICustomerServices
    {
        private readonly SalesDBContext _context;
        private readonly IMapper _mapper;

        public CustromerServices(SalesDBContext context, IMapper mapper)
        {
            _context = context;
            _mapper = mapper;
        }

        public async Task<List<customerViewModel>> GetCustomers()
        {
            var customers = await _context.Customers.ToListAsync();
            return _mapper.Map<List<customerViewModel>>(customers);
        }

        public async Task<List<customerViewModel>> GetCustomers(int? id)
        {
            var customers = await _context.Customers.Where(c => c.Id == id).ToListAsync();
            return _mapper.Map<List<customerViewModel>>(customers);
        }

        public async Task<Boolean> updateCustomerAsync(customerViewModel model)
        {
            var customerToUpdate = await _context.Customers.FindAsync(model.Id);

            if (customerToUpdate != null)
            {
                customerToUpdate.Name = model.Name;
                customerToUpdate.Address = model.Address;

                _context.Customers.Update(customerToUpdate);
                var results = await _context.SaveChangesAsync();
                if (results > 0)
                {
                    return true;
                }
            }
            return false;
        }

        public async Task<Boolean> deleteCustomer(int id)
        {
            var customer = await _context.Customers.FindAsync(id);
            if (customer == null)
            {
                return false;
            }
            _context.Customers.Remove(customer);
            var results = await _context.SaveChangesAsync();
            if (results > 0)
            {
                return true;
            }
            return false;
        }

        public async Task<int> createCustomer(createCustomerViewModel model)
        {
            var customer = new Customer
            {
                Name = model.Name,
                Address = model.Address,
            };
            _context.Customers.Add(customer);
            await _context.SaveChangesAsync();
            return customer.Id;
        }
    }
}
