using Ecommerce.Kafka;
using Ecommerce.Model;
using Ecommerce.Order.Data;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace Ecommerce.Order.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class OrderController : ControllerBase
    {
        private readonly OrderDbContext _context;
        private readonly string _kafkaServer = Environment.GetEnvironmentVariable("KAFKA_SERVER") ?? "localhost:9092";
        public OrderController(OrderDbContext context)
        {
            _context = context;
        }


        [HttpGet]
        public IActionResult GetOrders()
        {
            var orders = _context.Orders.ToList();
            return Ok(orders);
        }

        [HttpPost]
        
        public async Task<IActionResult> CreateOrderAsync([FromBody] OrderModel order)
        {
            _context.Orders.Add(order);
            _context.SaveChanges();
            // create kafka producer and send message
            var producer = new KafkaProducer<string, OrderModel>(_kafkaServer);
            await producer.ProduceAsync("orders", order.Id.ToString(), order);
            return CreatedAtAction(nameof(GetOrders), new { id = order.Id }, order);
        }

        [HttpGet("{id}")]
        public IActionResult GetOrderById(int id)
        {
            var order = _context.Orders.Find(id);
            if (order == null)
            {
                return NotFound();
            }
            return Ok(order);
        }
        [HttpPut("{id}")]
        public IActionResult UpdateOrder(int id, [FromBody] OrderModel order)
        {
            if (id != order.Id)
            {
                return BadRequest();
            }

            _context.Entry(order).State = Microsoft.EntityFrameworkCore.EntityState.Modified;
            _context.SaveChanges();

            return NoContent();
        }
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteOrder(int id){
            var order = await _context.Orders.FindAsync(id);
            if (order == null)
            {
                return NotFound();
            }
            _context.Orders.Remove(order);
            await _context.SaveChangesAsync();

            //kafka produce
            var producer = new KafkaProducer<string, OrderModel>(_kafkaServer??"localhost:9092");
            order.Quantity=-1*order.Quantity;
            await producer.ProduceAsync("orders", order.Id.ToString(), order);

            
            return Ok();
        }
    }
}
