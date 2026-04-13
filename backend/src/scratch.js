fetch("https://restaurant-management-app-6blw.onrender.com/api/orders?kitchen=true")
  .then(res => res.json())
  .then(data => {
    console.log("Kitchen orders count:", data.length);
    console.log(JSON.stringify(data.slice(0, 5).map(o => ({
      id: o.id,
      orderNumber: o.orderNumber,
      source: o.source,
      status: o.status,
      tableId: o.tableId
    })), null, 2));
  })
  .catch(console.error);
