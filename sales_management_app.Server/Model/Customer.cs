using Microsoft.AspNetCore.Mvc.ModelBinding;
using System.ComponentModel.DataAnnotations.Schema;
using System.Text.Json.Serialization;

namespace sales_management_app.Server.Model
{
    public class Customer
    {
        public int Id { get; set; }
        public string Name { get; set; }
        public string Address { get; set; }
       
        public virtual ICollection<Sales> Sales { get; set; } = new List<Sales>();
    }
}
