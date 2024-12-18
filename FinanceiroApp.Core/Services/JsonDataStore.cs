using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Text.Json;
using System.Transactions;

namespace FinanceiroApp.Core.Services
{
    public class JsonDataStore<T> : IDataStore<T> where T : class
  {
    private readonly string _dataDirectory;
    private readonly string _filePath;
    private List<T> _items;

    public JsonDataStore(string dataDirectory)
    {
      _dataDirectory = dataDirectory;
      _filePath = Path.Combine(_dataDirectory, $"{typeof(T).Name.ToLower()}s.json");
      _items = LoadData();
    }

    private List<T> LoadData()
    {
      if (!File.Exists(_filePath))
        return new List<T>();

      var jsonString = File.ReadAllText(_filePath);
      return string.IsNullOrEmpty(jsonString)
          ? new List<T>()
          : JsonSerializer.Deserialize<List<T>>(jsonString);
    }

    private void SaveData()
    {
      var jsonString = JsonSerializer.Serialize(_items);
      File.WriteAllText(_filePath, jsonString);
    }

    public IEnumerable<T> GetAll()
    {
      return _items;
    }

    public T GetById(int id)
    {
      var idProperty = typeof(T).GetProperty("Id");
      return _items.FirstOrDefault(item =>
          (int)idProperty.GetValue(item) == id);
    }

    public void Add(T entity)
    {
      if (entity == null)
        throw new ArgumentNullException(nameof(entity));

      var idProperty = typeof(T).GetProperty("Id");
      var maxId = _items.Any()
          ? _items.Max(item => (int)idProperty.GetValue(item))
          : 0;

      idProperty.SetValue(entity, maxId + 1);
      _items.Add(entity);
      SaveData();
    }

    public void Update(T entity)
    {
      if (entity == null)
        throw new ArgumentNullException(nameof(entity));

      var idProperty = typeof(T).GetProperty("Id");
      var id = (int)idProperty.GetValue(entity);
      var index = _items.FindIndex(item =>
          (int)idProperty.GetValue(item) == id);

      if (index != -1)
      {
        _items[index] = entity;
        SaveData();
      }
    }

    public void Delete(int id)
    {
      var idProperty = typeof(T).GetProperty("Id");
      var entity = _items.FirstOrDefault(item =>
          (int)idProperty.GetValue(item) == id);

      if (entity != null)
      {
        _items.Remove(entity);
        SaveData();
      }
    }
  }
}
