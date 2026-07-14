import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

function placeholderImage(slug: string) {
  return `https://picsum.photos/seed/${slug}/300/200`;
}

async function main() {
  const username = process.env.ADMIN_USERNAME ?? "admin";
  const password = process.env.ADMIN_PASSWORD ?? "admin12345";

  const passwordHash = await bcrypt.hash(password, 10);

  await prisma.user.upsert({
    where: { username },
    update: { passwordHash },
    create: { username, passwordHash, role: "admin" },
  });

  const sampleProducts = [
    // Electronics
    {
      name: "Wireless Mouse",
      description: "Ergonomic 2.4GHz wireless mouse with adjustable DPI",
      price: 29.99,
      sku: "MOU-001",
      category: "electronics",
      stock: 120,
      imageUrl: placeholderImage("wireless-mouse"),
    },
    {
      name: "Mechanical Keyboard",
      description: "Hot-swappable mechanical keyboard, tactile brown switches",
      price: 89.99,
      sku: "KEY-001",
      category: "electronics",
      stock: 45,
      imageUrl: placeholderImage("mechanical-keyboard"),
    },
    {
      name: "Bluetooth Headphones",
      description: "Over-ear headphones with active noise cancellation",
      price: 129.0,
      sku: "HDPHN-001",
      category: "electronics",
      stock: 60,
      imageUrl: placeholderImage("bluetooth-headphones"),
    },
    {
      name: "27-inch LED Monitor",
      description: "1440p IPS monitor, 144Hz refresh rate",
      price: 249.99,
      sku: "MON-001",
      category: "electronics",
      stock: 18,
      imageUrl: placeholderImage("led-monitor"),
    },
    {
      name: "HD Webcam",
      description: "1080p webcam with built-in privacy shutter",
      price: 39.5,
      sku: "WEBCAM-001",
      category: "electronics",
      stock: 75,
      imageUrl: placeholderImage("hd-webcam"),
    },
    {
      name: "Bluetooth Speaker",
      description: "Portable waterproof speaker, 12h battery life",
      price: 59.99,
      sku: "SPKR-001",
      category: "electronics",
      stock: 0,
      imageUrl: placeholderImage("bluetooth-speaker"),
    },
    {
      name: "65W USB-C Charger",
      description: "Compact GaN charger, single port",
      price: 24.99,
      sku: "CHRG-001",
      category: "electronics",
      stock: 200,
      imageUrl: placeholderImage("usb-c-charger"),
    },
    {
      name: "USB-C Hub 7-in-1",
      description: "HDMI, USB-A, SD card, and Ethernet in one hub",
      price: 34.0,
      sku: "HUB-001",
      category: "electronics",
      stock: 90,
      imageUrl: placeholderImage("usb-c-hub"),
    },

    // Kitchen
    {
      name: "Ceramic Coffee Mug",
      description: "350ml matte-finish ceramic mug",
      price: 12.5,
      sku: "MUG-001",
      category: "kitchen",
      stock: 300,
      imageUrl: placeholderImage("coffee-mug"),
    },
    {
      name: "Electric Kettle",
      description: "1.7L rapid-boil kettle with auto shut-off",
      price: 32.99,
      sku: "KTL-001",
      category: "kitchen",
      stock: 55,
      imageUrl: placeholderImage("electric-kettle"),
    },
    {
      name: "Countertop Blender",
      description: "600W blender with 3 speed settings",
      price: 74.99,
      sku: "BLD-001",
      category: "kitchen",
      stock: 22,
      imageUrl: placeholderImage("countertop-blender"),
    },
    {
      name: "2-Slice Toaster",
      description: "Wide-slot toaster with 6 browning levels",
      price: 27.5,
      sku: "TST-001",
      category: "kitchen",
      stock: 0,
      imageUrl: placeholderImage("toaster"),
    },
    {
      name: "Stainless Steel Cutlery Set",
      description: "24-piece cutlery set for 6 people",
      price: 45.0,
      sku: "CUT-001",
      category: "kitchen",
      stock: 40,
      imageUrl: placeholderImage("cutlery-set"),
    },
    {
      name: "Non-stick Frying Pan",
      description: "28cm frying pan, induction compatible",
      price: 21.99,
      sku: "PAN-001",
      category: "kitchen",
      stock: 65,
      imageUrl: placeholderImage("frying-pan"),
    },

    // Furniture
    {
      name: "Standing Desk Mat",
      description: "Anti-fatigue mat for standing desks",
      price: 45.0,
      sku: "MAT-001",
      category: "furniture",
      stock: 0,
      imageUrl: placeholderImage("desk-mat"),
    },
    {
      name: "Adjustable Standing Desk",
      description: "Electric height-adjustable desk, 120x60cm top",
      price: 349.0,
      sku: "DSK-001",
      category: "furniture",
      stock: 12,
      imageUrl: placeholderImage("standing-desk"),
    },
    {
      name: "Ergonomic Office Chair",
      description: "Mesh back chair with adjustable lumbar support",
      price: 189.99,
      sku: "CHR-001",
      category: "furniture",
      stock: 30,
      imageUrl: placeholderImage("office-chair"),
    },
    {
      name: "5-Tier Bookshelf",
      description: "Freestanding open-shelf bookcase",
      price: 95.0,
      sku: "SHF-001",
      category: "furniture",
      stock: 8,
      imageUrl: placeholderImage("bookshelf"),
    },
    {
      name: "LED Desk Lamp",
      description: "Dimmable desk lamp with USB charging port",
      price: 29.99,
      sku: "LMP-001",
      category: "furniture",
      stock: 70,
      imageUrl: placeholderImage("desk-lamp"),
    },
    {
      name: "Bar Stool",
      description: "Adjustable height swivel bar stool",
      price: 59.0,
      sku: "STL-001",
      category: "furniture",
      stock: 25,
      imageUrl: placeholderImage("bar-stool"),
    },

    // Office supplies
    {
      name: "Spiral Notebook",
      description: "A5 lined notebook, 120 pages",
      price: 4.5,
      sku: "NTB-001",
      category: "office",
      stock: 500,
      imageUrl: placeholderImage("spiral-notebook"),
    },
    {
      name: "Gel Pen Set",
      description: "Pack of 12 assorted-color gel pens",
      price: 8.99,
      sku: "PEN-001",
      category: "office",
      stock: 250,
      imageUrl: placeholderImage("gel-pen-set"),
    },
    {
      name: "Heavy-Duty Stapler",
      description: "Staples up to 100 sheets at once",
      price: 15.0,
      sku: "STPL-001",
      category: "office",
      stock: 40,
      imageUrl: placeholderImage("stapler"),
    },
    {
      name: "Document Folder Set",
      description: "Pack of 10 expanding document folders",
      price: 11.99,
      sku: "FLD-001",
      category: "office",
      stock: 0,
      imageUrl: placeholderImage("document-folders"),
    },
    {
      name: "Whiteboard 60x90cm",
      description: "Magnetic dry-erase whiteboard with aluminum frame",
      price: 42.0,
      sku: "WBRD-001",
      category: "office",
      stock: 15,
      imageUrl: placeholderImage("whiteboard"),
    },

    // Sports
    {
      name: "Yoga Mat",
      description: "6mm non-slip yoga mat with carry strap",
      price: 19.99,
      sku: "YGM-001",
      category: "sports",
      stock: 85,
      imageUrl: placeholderImage("yoga-mat"),
    },
    {
      name: "Adjustable Dumbbell Set",
      description: "Pair of dumbbells, 2-24kg adjustable range",
      price: 199.0,
      sku: "DMB-001",
      category: "sports",
      stock: 10,
      imageUrl: placeholderImage("dumbbell-set"),
    },
    {
      name: "Insulated Water Bottle",
      description: "750ml stainless steel bottle, keeps drinks cold 24h",
      price: 17.5,
      sku: "BTL-001",
      category: "sports",
      stock: 150,
      imageUrl: placeholderImage("water-bottle"),
    },
    {
      name: "Resistance Bands Set",
      description: "5 bands of varying resistance with carry bag",
      price: 14.99,
      sku: "RES-001",
      category: "sports",
      stock: 95,
      imageUrl: placeholderImage("resistance-bands"),
    },
    {
      name: "Foam Roller",
      description: "High-density foam roller for muscle recovery",
      price: 22.0,
      sku: "RCK-001",
      category: "sports",
      stock: 0,
      imageUrl: placeholderImage("foam-roller"),
    },
  ];

  for (const product of sampleProducts) {
    await prisma.product.upsert({
      where: { sku: product.sku },
      update: {},
      create: product,
    });
  }
}

main()
  .catch((err) => {
    console.error(err);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
