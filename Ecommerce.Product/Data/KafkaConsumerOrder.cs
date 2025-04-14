using Confluent.Kafka;
using Ecommerce.Model;
using Newtonsoft.Json;

namespace Ecommerce.Product.Data
{
    public class KafkaConsumerOrder(IServiceScopeFactory scopeFactory) : BackgroundService
    {
        protected override Task ExecuteAsync(CancellationToken stoppingToken)
        {

            return Task.Run(() =>
            {
                _ = ConsumeAsync("orders", stoppingToken);
            }, stoppingToken);
        }

        public async Task ConsumeAsync(string topic, CancellationToken stoppingToken)
        {
            var config = new ConsumerConfig
            {
                GroupId = "order-group",
                BootstrapServers = Environment.GetEnvironmentVariable("KAFKA_SERVER") ?? "localhost:9092",
                AutoOffsetReset = AutoOffsetReset.Earliest
            };
            using var consumer = new ConsumerBuilder<string, string>(config).Build();

            consumer.Subscribe(topic);
            while (!stoppingToken.IsCancellationRequested)
            {
                var consumeResult = consumer.Consume(stoppingToken);

                var order = JsonConvert.DeserializeObject<OrderMessage>(consumeResult.Message.Value);
                using var scope = scopeFactory.CreateScope();
                var dbContext = scope.ServiceProvider.GetRequiredService<ProductDbContext>();

                // Check if the order is valid
                if (order == null )
                {
                    Console.WriteLine("Invalid order message received.");
                    continue;
                }

                Console.WriteLine($"Processing order for ProductId: {order.ProductId}, Quantity: {order.Quantity}");
                // Process the order message
                var product = await dbContext.Products.FindAsync(order.ProductId);
                if (product != null)
                {
                    product.Quantity -= order.Quantity;
                    await dbContext.SaveChangesAsync();
                }
                else
                {
                    Console.WriteLine($"Product with ID {order.ProductId} not found.");
                }
            }
            consumer.Close();
        }
    }
}