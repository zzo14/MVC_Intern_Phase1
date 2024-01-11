using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using sales_management_app.Server.Model;
using sales_management_app.Server.Services;
using sales_management_app.Server.ViewModel;

namespace sales_management_app.Server.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class SalesController : ControllerBase
    {
        private readonly ISalesServices _salesServices;

        public SalesController(ISalesServices salesServices)
        {
            _salesServices = salesServices;
        }

        [HttpGet]
        public async Task<ActionResult> GetSales()
        {
            var sales = await _salesServices.GetSales();
            if (sales is [])
            {
                return NotFound("Could not find any Sales");
            }
            return Ok(sales);
        }

        [HttpPost]
        public async Task<ActionResult> CreateSale([FromBody]createSalesViewModel sale)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest();
            }
            var saleId = await _salesServices.createSale(sale);
            if (saleId == 0)
            {
                return NotFound("Could not create this sale, please check the entered ids.");
            }
            return Ok(saleId);
        }

        [HttpPut]
        public async Task<ActionResult> UpdateSale([FromBody]salesViewModel sale)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest();
            }
            var result = await _salesServices.updateSaleAsync(sale);
            if (!result)
            {
                return NotFound("Could not update this sale");
            }
            return Ok(result);
        }

        [HttpDelete]
        public async Task<ActionResult<Boolean>> DeleteSale(int id)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest();
            }
            var result = await _salesServices.deleteSale(id);
            if (!result)
            {
                return NotFound("Could not delete this sale");
            }
            return Ok(result);
        }

    }
}
