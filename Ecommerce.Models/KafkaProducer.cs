using System;

namespace Ecommerce.Kafka;

using Confluent.Kafka;
using System;
using System.Threading.Tasks;
using System.Text.Json;
using Ecommerce.Model; // Using correct namespace

public class KafkaProducer<TKey, TValue>
{
    private readonly IProducer<TKey, TValue> _producer;

    public KafkaProducer(string bootstrapServers)
    {
        var config = new ProducerConfig { BootstrapServers = bootstrapServers };
        _producer = new ProducerBuilder<TKey, TValue>(config)
            .SetValueSerializer(new JsonSerializer<TValue>())
            .Build();
    }

    public async Task ProduceAsync(string topic, TKey key, TValue value)
    {
        try
        {
            var result = await _producer.ProduceAsync(topic, new Message<TKey, TValue> { Key = key, Value = value });
            Console.WriteLine($"Message sent to {result.TopicPartitionOffset}");
        }
        catch (ProduceException<TKey, TValue> e)
        {
            Console.WriteLine($"Delivery failed: {e.Error.Reason}");
        }
    }

    public void Dispose()
    {
        _producer.Flush(TimeSpan.FromSeconds(10));
        _producer.Dispose();
    }
}

// Custom JSON serializer for Kafka messages
public class JsonSerializer<T> : ISerializer<T>
{
    public byte[] Serialize(T data, SerializationContext context)
    {
        if (data == null)
            return null!; // Adding null-forgiving operator

        return JsonSerializer.SerializeToUtf8Bytes(data);
    }
}

