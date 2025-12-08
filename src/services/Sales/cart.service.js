// ==========================================
// 🔹 CART SERVICE — BUSINESS LOGIC
// ==========================================
import { cartRepo } from "../../repo/Sales/cart.repo.js";
import * as productRepo from "../../repo/Products/product.repo.js";
import AppErrors from "../../utils/AppErrors.js";

export const cartService = {

  /* -------------------------------
     GET USER CART
  -------------------------------- */
  async getCart(userId) {
    const cart = await cartRepo.findByUser(userId);
    if (!cart) throw AppErrors.notFound("Cart not found / السلة غير موجودة");
    return cart;
  },

  /* -------------------------------
     ADD ITEM TO CART
  -------------------------------- */
  async addItem(userId, itemData) {
    const { product, variant, quantity } = itemData;

    const productData = await productRepo.findById(product);
    if (!productData) throw AppErrors.notFound("Product not found / المنتج غير موجود");

    const price = productData.price;

    const newItem = {
      product,
      variant,
      quantity,
      priceAtAddition: price,
      totalItemPrice: price * quantity,
    };

    let cart = await cartRepo.findByUser(userId);

    if (!cart) {
      return cartRepo.create({
        user: userId,
        items: [newItem],
      });
    }

    const existing = cart.items.find(
      (i) =>
        i.product.toString() === product &&
        i.variant.size === variant.size &&
        i.variant.color === variant.color
    );

    if (existing) {
      existing.quantity += quantity;
      existing.totalItemPrice = existing.quantity * price;
    } else {
      cart.items.push(newItem);
    }

    await cart.save();
    return cart;
  },

  /* -------------------------------
     REMOVE ITEM
  -------------------------------- */
  async removeItem(userId, productId, variant) {
    const cart = await cartRepo.findByUser(userId);
    if (!cart) throw AppErrors.notFound("Cart not found / السلة غير موجودة");

    cart.items = cart.items.filter(
      (item) =>
        !(
          item.product.toString() === productId &&
          item.variant.size === variant.size &&
          item.variant.color === variant.color
        )
    );

    await cart.save();
    return cart;
  },

  /* -------------------------------
     CLEAR CART
  -------------------------------- */
  async clearCart(userId) {
    return cartRepo.updateByUser(userId, { items: [] });
  },
};