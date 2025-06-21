import emailjs from "@emailjs/browser";

export async function sendOrderConfirmation(orderData) {
  console.log("Received order details:", typeof orderData.products);
  
  const products = JSON.parse(orderData.products).map(product => ({
  product_name: product.productName,
  units: product.productCount,
  price: product.productPrice,
  item: product.productImage
}));
  
  console.log("PRODUCTS LISTS:", products)
  console.log("PRODUCTS LISTS TYPE:", typeof products)

  try {
    const result = await emailjs.send(
      "service_n8i2grb",
      "template_p94nn1s",
      {
        to_email: orderData.email,
        order_number: orderData.orderNumber,
        customer_name: orderData.name,
        sub_total: orderData.subtotal,
        tax_amount: orderData.taxAmount,
        shipping_amount: orderData.shippingAmount || "0.00",
        total_amount: Number(orderData.subtotal) + Number(orderData.taxAmount),
        payment_status: orderData.paymentStatus,
        order_notes: orderData.orderNotes,
        ship_to_address: orderData.shipToAddress,
        ship_to_city: orderData.shipToCity,
        zipcode: orderData.zipCode,
        order_date: orderData.orderDate.split("T")[0],
        orders: products,
      },
      "7EwHPHWv9ecVPr3Hp"
    );

    return { success: true, data: result };
  } catch (error) {
    return { success: false, error: error.text };
  }
}
