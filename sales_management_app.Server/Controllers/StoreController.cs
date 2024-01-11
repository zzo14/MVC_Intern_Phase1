using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using sales_management_app.Server.Model;
using sales_management_app.Server.Services;
using sales_management_app.Server.ViewModel;

namespace sales_management_app.Server.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class StoreController : ControllerBase
    {
        private readonly IStoreServices _storeServices;

        public StoreController(IStoreServices storeServices)
        {
            _storeServices = storeServices;
        }

        [HttpGet]
        public async Task<ActionResult> GetStores()
        {
            var stores = await _storeServices.GetStores();
            if (stores is [])
            {
                return NotFound("Could not find any Stores");
            }
            return Ok(stores);
        }

        [HttpGet("{id}")]
        public async Task<ActionResult> GetStores(int? id)
        {
            var stores = await _storeServices.GetStores(id);
            if (stores is [])
            {
                return NotFound("Could not find any Stores");
            }
            return Ok(stores);
        }

        [HttpPost]
        public async Task<ActionResult> CreateStore([FromBody]createStoreViewModel store)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest();
            }
            var storeId = await _storeServices.createStore(store);
            return Ok(storeId);
        }

        [HttpPut]
        public async Task<ActionResult> UpdateStore([FromBody]storeViewModel store)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest();
            }
            var result = await _storeServices.updateStoreAsync(store);
            if (!result)
            {
                return NotFound("Could not update this store");
            }
            return Ok(result);
        }

        [HttpDelete]
        public async Task<ActionResult<Boolean>> DeleteStore(int id)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest();
            }
            var result = await _storeServices.deleteStore(id);
            if (!result)
            {
                return NotFound("Could not delete this store");
            }
            return Ok(result);
        }

    }
}
