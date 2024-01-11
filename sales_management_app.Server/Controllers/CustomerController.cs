using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using sales_management_app.Server.Model;
using sales_management_app.Server.Services;
using sales_management_app.Server.ViewModel;

namespace sales_management_app.Server.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class CustomerController : ControllerBase
    {
        private readonly ICustomerServices _customerServices;

        public CustomerController(ICustomerServices customerServices)
        {
            _customerServices = customerServices;
        }

        [HttpGet]
        public async Task<ActionResult> GetCustomers()
        {
            var customers = await _customerServices.GetCustomers();
            if (customers is [])
            {
                return NotFound("Could not find any Customers");
            }
            return Ok(customers);
        }

        [HttpGet("{id}")]
        public async Task<ActionResult> GetCustomers(int? id)
        {
            var customers = await _customerServices.GetCustomers(id);
            if (customers is [])
            {
                return NotFound("Could not find any Customers");
            }
            return Ok(customers);
        }


        [HttpPost]
        public async Task<ActionResult> CreateCustomer([FromBody]createCustomerViewModel customer)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest();
            }
            var cusomterId = await _customerServices.createCustomer(customer);
            return Ok(cusomterId);
        }

        [HttpPut]
        public async Task<ActionResult> UpdateCustomer([FromBody]customerViewModel customer)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest();
            }
            var result = await _customerServices.updateCustomerAsync(customer);
            if (!result)
            {
                return NotFound("Could not update this customer");
            }
            return Ok(result);
        }

        [HttpDelete]
        public async Task<ActionResult<Boolean>> DeleteCustomer(int id)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }
            var result = await _customerServices.deleteCustomer(id);
            if (!result)
            {
                return NotFound("Could not delete this customer");
            }
            return Ok(result);
        }
    }
}
