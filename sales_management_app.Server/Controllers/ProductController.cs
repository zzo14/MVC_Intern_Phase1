using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Http;
using sales_management_app.Server.Model;
using sales_management_app.Server.Services;
using sales_management_app.Server.ViewModel;

namespace sales_management_app.Server.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class ProductController : ControllerBase
    {
        private readonly IProductServices _productServices;

        public ProductController(IProductServices productServices)
        {
            _productServices = productServices;
        }

        [HttpGet]
        public async Task<ActionResult> GetProducts()
        {
            var products = await _productServices.GetProducts();
            if (products is [])
            {
                return NotFound("Could not find any Products");
            }
            return Ok(products);
        }

        [HttpGet("{id}")]
        public async Task<ActionResult> GetProducts(int? id)
        {
            var products = await _productServices.GetProducts(id);
            if (products is [])
            {
                return NotFound("Could not find any Products");
            }
            return Ok(products);
        }

        [HttpPost]
        public async Task<ActionResult> CreateProduct([FromBody]createProductViewModel product)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest();
            }
            var productId = await _productServices.createProduct(product);
            return Ok(productId);
        }

        [HttpPut]
        public async Task<ActionResult> UpdateProduct([FromBody]productViewModel product)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest();
            }
            var result = await _productServices.updateProductAsync(product);
            if (!result)
            {
                return NotFound("Could not update this product");
            }
            return Ok(result);
        }

        [HttpDelete]
        public async Task<ActionResult<Boolean>> DeleteProduct(int id)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest();
            }
            var result = await _productServices.deleteProduct(id);
            if (!result)
            {
                return NotFound("Could not delete this product");
            }
            return Ok(result);
        }
    }
}
