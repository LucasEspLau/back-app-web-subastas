import express from 'express';
import * as boxAuctionController from './controllers/boxAuctionController.mjs';
import * as betController from './controllers/betController.mjs';
import * as loginController from './controllers/loginController.mjs'; // Importa el controlador de login
import * as clientController from './controllers/clientController.mjs';
import * as auctionController from './controllers/auctionController.mjs'
import * as productController from './controllers/productController.mjs'
import multer from 'multer';

const upload = multer({ storage: multer.memoryStorage() });
const router = express.Router();

// Definir rutas para Box_Auction
router.get('/box-auctions', boxAuctionController.fetchAllBoxAuctions);
router.get('/box-auctions/:id', boxAuctionController.fetchBoxAuctionById);

// Definir rutas para las apuestas
router.post('/bets', betController.createBet);
router.get('/bets-auction/:id', betController.getBetsForAuction);

// Definir ruta para el inicio de sesión
router.post('/login', loginController.loginClient); // Usa loginClient del controlador de login
router.post('/admin-login', loginController.loginAdmin);

router.get('/clients', clientController.getAllClients);
router.put('/clients/:id', clientController.updateClient);

router.post('/createclient', clientController.createClient);


router.put('/auctions/:id/state', auctionController.updateAuctionState);
router.post('/auction-create', auctionController.createAuction);


router.get('/products', productController.getAllProducts)
router.put('/products/:id',upload.single('image'),productController.updateProduct)
router.post('/product-create',upload.single('image'), productController.createProduct)
export default router;
