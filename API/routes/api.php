<?php
/*
  Authors : initappz (Rahul Jograna)
  Website : https://initappz.com/
  App Name : Food Delivery Ionic 7 And Laravel
  This App Template Source code is licensed as per the
  terms found in the Website https://initappz.com/license
  Copyright and Good Faith Purchasers © 2023-present initappz.
*/
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\v1\UsersController;
use App\Http\Controllers\v1\CitiesController;
use App\Http\Controllers\v1\StoresController;
use App\Http\Controllers\v1\DriversController;
use App\Http\Controllers\v1\ManageController;
use App\Http\Controllers\v1\PopupController;
use App\Http\Controllers\v1\GeneralController;
use App\Http\Controllers\v1\SettingsController;
use App\Http\Controllers\v1\OtpController;
use App\Http\Controllers\v1\CategoriesController;
use App\Http\Controllers\v1\FoodsController;
use App\Http\Controllers\v1\PaymentsController;
use App\Http\Controllers\v1\PaytmPayController;
use App\Http\Controllers\v1\PagesController;
use App\Http\Controllers\v1\BlogsController;
use App\Http\Controllers\v1\BannersController;
use App\Http\Controllers\v1\OffersController;
use App\Http\Controllers\v1\ReferralCodesController;
use App\Http\Controllers\v1\ReferralController;
use App\Http\Controllers\v1\AddressController;
use App\Http\Controllers\v1\OrdersController;
use App\Http\Controllers\v1\ChatRoomsController;
use App\Http\Controllers\v1\ConversionsController;
use App\Http\Controllers\v1\RatingController;
use App\Http\Controllers\v1\ContactsController;
use App\Http\Controllers\v1\LanguagesController;
/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| is assigned the "api" middleware group. Enjoy building your API!
|
*/

Route::get('/', function () {
    return [
        'app' => 'Foodies Ionic 7 API',
        'version' => '1.0.0',
    ];
});

Route::middleware('auth:sanctum')->get('/user', function (Request $request) {
    return $request->user();
});


Route::prefix('/v1')->group(function () {
    Route::get('users/get_admin', [UsersController::class, 'get_admin']);
    Route::post('auth/create_admin_account', [UsersController::class, 'create_admin_account']);
    Route::post('auth/login', [UsersController::class, 'login']);
    Route::post('auth/loginWithPhonePassword', [UsersController::class, 'loginWithPhonePassword']);
    Route::post('otp/verifyPhone',[UsersController::class, 'verifyPhone'] );
    Route::post('auth/loginWithMobileOtp', [UsersController::class, 'loginWithMobileOtp']);
    Route::post('auth/verifyPhoneForFirebase', [UsersController::class, 'verifyPhoneForFirebase']);
    Route::get('auth/firebaseauth', [UsersController::class, 'firebaseauth']);

    Route::post('auth/verifyEmailForReset', [UsersController::class, 'verifyEmailForReset']);
    Route::post('otp/verifyOTPReset',[OtpController::class, 'verifyOTPReset'] );
    Route::post('otp/verifyOTPWithMobileReset',[OtpController::class, 'verifyOTPWithMobileReset'] );
    Route::post('otp/getFirebaseToken',[OtpController::class, 'getFirebaseToken'] );

    Route::post('driver/login', [DriversController::class, 'login']);
    Route::post('driver/verifyEmailForReset', [DriversController::class, 'verifyEmailForReset']);
    Route::post('driver/verifyPhone',[DriversController::class, 'verifyPhone'] );
    Route::post('driver/verifyPhoneForFirebase', [DriversController::class, 'verifyPhoneForFirebase']);
    Route::post('otp/getFirebaseTokenDriver',[OtpController::class, 'getFirebaseTokenDriver'] );

    Route::post('otp/verifyOTPResetDriver',[OtpController::class, 'verifyOTPResetDriver'] );
    Route::post('otp/verifyOTPWithMobileResetDriver',[OtpController::class, 'verifyOTPWithMobileResetDriver'] );

    Route::post('driver/loginWithPhonePassword', [DriversController::class, 'loginWithPhonePassword']);
    Route::post('driver/loginWithMobileOtp', [DriversController::class, 'loginWithMobileOtp']);

    // Admin Auth
    Route::group(['middleware' => ['admin_auth', 'jwt.auth']], function () {
        // Cities Admin Routes
        Route::get('cities/getAll', [CitiesController::class, 'getAll']);
        Route::post('cities/save', [CitiesController::class, 'save']);
        Route::post('cities/getById', [CitiesController::class, 'getById']);
        Route::post('cities/update', [CitiesController::class, 'update']);
        Route::post('cities/delete', [CitiesController::class, 'delete']);
        Route::post('cities/importData', [CitiesController::class, 'importData']);

        // Stores Admin Routes
        Route::get('stores/getAll', [StoresController::class, 'getAll']);
        Route::post('stores/save', [StoresController::class, 'save']);
        Route::post('stores/getById', [StoresController::class, 'getById']);
        Route::post('stores/update', [StoresController::class, 'update']);
        Route::post('stores/delete', [StoresController::class, 'delete']);
        Route::post('stores/importData', [StoresController::class, 'importData']);
        Route::post('stores/update_store_user', [StoresController::class, 'update_store_user']);

        // Users Admin Routes
        Route::get('users/users_list', [UsersController::class, 'users_list']);
        Route::post('users/importData', [UsersController::class, 'importData']);
        Route::post('users/update', [UsersController::class, 'update']);
        Route::post('users/create_store_account', [UsersController::class, 'create_store_account']);
        Route::post('auth/admin_logout', [UsersController::class, 'logout']);

        // Drivers Admin Routes
        Route::get('drivers/getAll', [DriversController::class, 'getAll']);
        Route::post('drivers/create_driver_account', [DriversController::class, 'create_driver_account']);
        Route::post('drivers/importData', [DriversController::class, 'importData']);
        Route::post('drivers/update', [DriversController::class, 'update']);

        // Manage Admin Routes
        Route::get('manage/getDefault', [ManageController::class, 'getDefault']);
        Route::post('manage/save', [ManageController::class, 'save']);
        Route::post('manage/update', [ManageController::class, 'update']);

        // Popup Admin Routes
        Route::get('popup/getDefault', [PopupController::class, 'getDefault']);
        Route::post('popup/save', [PopupController::class, 'save']);
        Route::post('popup/update', [PopupController::class, 'update']);

        // General Admin Routes
        Route::get('general/getDefault', [GeneralController::class, 'getDefault']);
        Route::post('general/save', [GeneralController::class, 'save']);
        Route::post('general/update', [GeneralController::class, 'update']);

        // Settings Admin Routes
        Route::get('settings/getDefault', [SettingsController::class, 'getDefault']);
        Route::post('settings/save', [SettingsController::class, 'save']);
        Route::post('settings/update', [SettingsController::class, 'update']);

        // Categories Admin Routes
        Route::get('categories/getAll', [CategoriesController::class, 'getAll']);
        Route::post('categories/updateStatus', [CategoriesController::class, 'update']);
        Route::post('categories/deleteItem', [CategoriesController::class, 'delete']);
        Route::post('categories/importData', [CategoriesController::class, 'importData']);

        // Foods Admin Routes
        Route::get('foods/getAll', [FoodsController::class, 'getAll']);
        Route::post('foods/updateStatus', [FoodsController::class, 'update']);
        Route::post('foods/deleteItem', [FoodsController::class, 'delete']);
        Route::post('foods/importData', [FoodsController::class, 'importData']);

        // Payment Admin Routes
        Route::post('payments/paytmRefund',[PaytmPayController::class, 'refundUserRequest']);
        Route::post('payments/paytmRefund',[PaytmPayController::class, 'refundUserRequest']);
        Route::post('payments/getById', [PaymentsController::class, 'getById']);
        Route::post('payments/getPaymentInfo', [PaymentsController::class, 'getPaymentInfo']);
        Route::get('payments/getAll', [PaymentsController::class, 'getAll']);
        Route::post('payments/update', [PaymentsController::class, 'update']);
        Route::post('payments/delete', [PaymentsController::class, 'delete']);
        Route::post('payments/refundFlutterwave', [PaymentsController::class, 'refundFlutterwave']);
        Route::post('payments/payPalRefund', [PaymentsController::class, 'payPalRefund']);
        Route::post('payments/refundPayStack',[PaymentsController::class, 'refundPayStack']);
        Route::post('payments/razorPayRefund',[PaymentsController::class, 'razorPayRefund']);
        Route::post('payments/refundStripePayments',[PaymentsController::class, 'refundStripePayments']);
        Route::post('payments/instaMOJORefund',[PaymentsController::class, 'instaMOJORefund']);

        // Pages Admin Routes
        Route::post('pages/getById', [PagesController::class, 'getById']);
        Route::get('pages/getAll', [PagesController::class, 'getAllPages']);
        Route::post('pages/update', [PagesController::class, 'update']);

        // New Administrator Routes
        Route::get('administrator/getAll', [UsersController::class, 'administratorList']);
        Route::post('administrator/update', [UsersController::class, 'administratorUpdate']);
        Route::post('administrator/adminNewAdmin', [UsersController::class, 'adminNewAdmin']);
        Route::post('administrator/deleteAdministrator', [UsersController::class, 'deleteAdministrator']);

        // Blogs Admin Routes
        Route::get('blogs/getAll', [BlogsController::class, 'getAll']);
        Route::post('blogs/save', [BlogsController::class, 'save']);
        Route::post('blogs/update', [BlogsController::class, 'update']);
        Route::post('blogs/delete', [BlogsController::class, 'delete']);
        Route::post('blogs/importData', [BlogsController::class, 'importData']);

        // Banners Admin Routes
        Route::get('banners/getAll', [BannersController::class, 'getAll']);
        Route::post('banners/save', [BannersController::class, 'save']);
        Route::post('banners/update', [BannersController::class, 'update']);
        Route::post('banners/delete', [BannersController::class, 'delete']);
        Route::post('banners/importData', [BannersController::class, 'importData']);


        // Offers Admin Routes
        Route::get('offers/getAll', [OffersController::class, 'getAll']);
        Route::post('offers/save', [OffersController::class, 'save']);
        Route::post('offers/update', [OffersController::class, 'update']);
        Route::post('offers/delete', [OffersController::class, 'delete']);
        Route::post('offers/importData', [OffersController::class, 'importData']);

        // Referral Admin Routes
        Route::get('referral/getAll', [ReferralController::class, 'getAll']);
        Route::post('referral/save', [ReferralController::class, 'save']);
        Route::post('referral/update', [ReferralController::class, 'update']);

        Route::get('contacts/getAll',[ContactsController::class, 'getAll'] );
        Route::post('contacts/update',[ContactsController::class, 'update'] );
        Route::post('mails/replyContactForm',[ContactsController::class, 'replyContactForm']);


        Route::get('orders/allOrders', [OrdersController::class, 'allOrders']);
        Route::post('orders/importData', [OrdersController::class, 'importData']);
        Route::post('orders/getOrderDetailsAdmin', [OrdersController::class, 'getOrderDetailsAdmin']);
        Route::post('orders/updateStatusAdmin', [OrdersController::class, 'update']);
        Route::get('orders/getDashboard', [OrdersController::class, 'getDashboard']);

        Route::post('orders/getUserOrdersAdmin', [OrdersController::class, 'getUserOrders']);
        Route::post('orders/userProfileAdmin', [OrdersController::class, 'userProfileAdmin']);
        Route::post('orders/driverProfileAdmin', [OrdersController::class, 'driverProfileAdmin']);

        Route::post('stores/getMyReviewsAdmin', [RatingController::class, 'getMyReviews']);

        Route::post('notification/sendToAllUsers', [UsersController::class, 'sendToAllUsers']);
        Route::post('notification/sendToUsers', [UsersController::class, 'sendToUsers']);
        Route::post('notification/sendToStores', [UsersController::class, 'sendToStores']);
        Route::post('notification/sendToDrivers', [UsersController::class, 'sendToDrivers']);

        Route::post('users/sendMailToUsers', [UsersController::class, 'sendMailToUsers']);
        Route::post('users/sendMailToAll', [UsersController::class, 'sendMailToAll']);
        Route::post('users/sendMailToStores', [UsersController::class, 'sendMailToStores']);
        Route::post('users/sendMailToDrivers', [UsersController::class, 'sendMailToDrivers']);

        Route::post('orders/getStatsByDateAdmin', [OrdersController::class, 'getStatsByDate']);
        Route::post('orders/getDriverStatsAdmin', [OrdersController::class, 'getDriverStatsAdmin']);

        Route::get('address/getAll', [AddressController::class, 'getAll']);
        Route::post('address/importData', [AddressController::class, 'importData']);

        Route::get('reviews/getAll', [RatingController::class, 'getAll']);
        Route::post('reviews/importData', [RatingController::class, 'importData']);

        // Languages Routes
        Route::get('languages/getAll', [LanguagesController::class, 'getAll']);
        Route::post('languages/save', [LanguagesController::class, 'save']);
        Route::post('languages/getById', [LanguagesController::class, 'getById']);
        Route::post('languages/update', [LanguagesController::class, 'update']);
        Route::post('languages/changeDefault', [LanguagesController::class, 'changeDefault']);
    });

    // Store Auth
    Route::group(['middleware' => ['store_auth', 'jwt.auth']], function () {
        /// Store Routes
        Route::post('stores/getMyInfo', [StoresController::class, 'getById']);
        Route::post('auth/store_logout', [UsersController::class, 'logout']);

        // Categories Store Routes
        Route::post('categories/getMyCategories', [CategoriesController::class, 'getMyCategories']);
        Route::post('categories/save', [CategoriesController::class, 'save']);
        Route::post('categories/update', [CategoriesController::class, 'update']);
        Route::post('categories/delete', [CategoriesController::class, 'delete']);

        // Foods Store Routes
        Route::post('foods/save', [FoodsController::class, 'save']);
        Route::post('foods/getByCategories', [FoodsController::class, 'getByCategories']);
        Route::post('foods/getById', [FoodsController::class, 'getById']);
        Route::post('foods/update', [FoodsController::class, 'update']);
        Route::post('foods/delete', [FoodsController::class, 'delete']);

        // Stores Order Routes
        Route::post('orders/getUserOrders', [OrdersController::class, 'getUserOrders']);
        Route::post('orders/getUserOrderById', [OrdersController::class, 'getUserOrderById']);
        Route::post('orders/completeOrder', [OrdersController::class, 'completeOrder']);
        Route::post('orders/updateStoreOrderStatus', [OrdersController::class, 'update']);
        Route::post('orders/getStatsByDate', [OrdersController::class, 'getStatsByDate']);
        Route::post('orders/acceptOrder', [OrdersController::class, 'acceptOrder']);
        Route::post('drivers/getNearMe', [DriversController::class, 'getNearMe']);

        // Store Routes
        Route::post('stores/updateMyProfile', [StoresController::class, 'update']);
        Route::post('stores/getMyReviews', [RatingController::class, 'getMyReviews']);

    });

    // Driver Auth
    Route::group(['middleware' => ['driver_auth', 'jwt.auth']], function () {
        Route::post('drivers/getById', [DriversController::class, 'getById']);

        Route::post('orders/getDriverOrders', [OrdersController::class, 'getDriverOrders']);
        Route::post('orders/getDriverOrderById', [OrdersController::class, 'getDriverOrderById']);
        Route::post('orders/completeMyOrder', [OrdersController::class, 'completeOrder']);
        Route::post('orders/updateMyOrder', [OrdersController::class, 'update']);
        Route::post('driver/user_logout', [DriversController::class, 'logout']);
        Route::post('driver/updateMyLocation', [DriversController::class, 'update']);
        Route::post('drivers/getMyRatings', [RatingController::class, 'getDriversReviews']);
    });

    // User Auth
    Route::group(['middleware' => ['user_auth', 'jwt.auth']], function () {
        // Payments Routes For Users
        Route::post('payments/createStripeToken', [PaymentsController::class, 'createStripeToken']);
        Route::post('payments/createCustomer', [PaymentsController::class, 'createCustomer']);
        Route::post('payments/getStripeCards', [PaymentsController::class, 'getStripeCards']);
        Route::post('payments/addStripeCards', [PaymentsController::class, 'addStripeCards']);
        Route::post('payments/createStripePayments', [PaymentsController::class, 'createStripePayments']);
        Route::get('getPayPalKey', [PaymentsController::class, 'getPayPalKey']);
        Route::get('getFlutterwaveKey', [PaymentsController::class, 'getFlutterwaveKey']);
        Route::get('getPaystackKey', [PaymentsController::class, 'getPaystackKey']);
        Route::get('getRazorPayKey', [PaymentsController::class, 'getRazorPayKey']);
        Route::get('payments/getPayments', [PaymentsController::class, 'getPayments']);

        Route::post('referralcode/getMyCode', [ReferralCodesController::class, 'getMyCode']);
        Route::post('referral/redeemReferral', [ReferralController::class, 'redeemReferral']);

        Route::get('offers/getActiveOffers', [OffersController::class, 'getActiveOffers']);

        Route::post('auth/user_logout', [UsersController::class, 'logout']);

        Route::post('address/getByUid', [AddressController::class, 'getByUid']);
        Route::post('address/save', [AddressController::class, 'save']);
        Route::post('address/getById', [AddressController::class, 'getById']);
        Route::post('address/update', [AddressController::class, 'update']);
        Route::post('address/delete', [AddressController::class, 'delete']);

        Route::post('users/getMyInfo', [UsersController::class, 'getMyInfo']);
        Route::post('users/getMyWalletBalance', [UsersController::class,'getMyWalletBalance']);
        Route::post('profile/update', [UsersController::class, 'update']);

        Route::post('stores/getOrderInfo', [StoresController::class, 'getOrderInfo']);
        Route::post('notification/sendNotification', [UsersController::class, 'sendNotification']);

        Route::post('orders/save', [OrdersController::class, 'save']);
        Route::post('orders/getMyOrders', [OrdersController::class, 'getMyOrders']);
        Route::post('orders/getById', [OrdersController::class, 'getById']);
        Route::post('orders/update', [OrdersController::class, 'update']);

        Route::post('driver/getDriverInfo', [DriversController::class, 'getById']);
        Route::post('driver/updateOrderStatus', [DriversController::class, 'update']);

        Route::post('chats/getChatRooms', [ChatRoomsController::class, 'getChatRooms']);
        Route::post('chats/createChatRooms', [ChatRoomsController::class, 'createChatRooms']);
        Route::post('chats/getChatListBUid', [ChatRoomsController::class, 'getChatListBUid']);
        Route::post('chats/getById', [ConversionsController::class, 'getById']);
        Route::post('chats/sendMessage', [ConversionsController::class, 'save']);

        Route::post('ratings/getStoreRatings', [RatingController::class, 'getStoreRatings']);
        Route::post('ratings/getProductsReview', [RatingController::class, 'getProductsReview']);
        Route::post('ratings/save', [RatingController::class, 'save']);
        Route::post('ratings/save_product_review', [RatingController::class, 'save_product_review']);
        Route::post('ratings/save_driver_review', [RatingController::class, 'save_driver_review']);

        Route::post('users/getMyWallet', [UsersController::class,'getMyWallet']);
        Route::post('password/updateUserPasswordWithEmail', [UsersController::class, 'updateUserPasswordWithEmail']);
        Route::post('password/updateUserPasswordWithPhone', [UsersController::class, 'updateUserPasswordWithPhone']);
        Route::post('password/updateUserPasswordWithPhoneFirebase', [UsersController::class, 'updateUserPasswordWithPhoneFirebase']);

        Route::post('password/updateUserPasswordWithEmailDriver', [DriversController::class, 'updateUserPasswordWithEmailDriver']);
        Route::post('password/updateUserPasswordWithPhoneDriver', [DriversController::class, 'updateUserPasswordWithPhoneDriver']);
        Route::post('password/updateUserPasswordWithPhoneFirebaseDriver', [DriversController::class, 'updateUserPasswordWithPhoneFirebaseDriver']);
    });

    // Open Routes

    Route::post('uploadImage', [UsersController::class, 'uploadImage']);
    Route::get('settings/appSettingsDefault', [SettingsController::class, 'appSettingsDefault']);
    Route::post('otp/verifyOTP',[OtpController::class, 'verifyOTP'] );
    Route::get('success_verified',[UsersController::class, 'success_verified']);

    // Open Payment Routes
    Route::get('success_payments',[PaymentsController::class, 'success_payments']);
    Route::get('failed_payments',[PaymentsController::class, 'failed_payments']);
    Route::get('instaMOJOWebSuccess',[PaymentsController::class, 'instaMOJOWebSuccess']);
    Route::get('instaMOJOWebSuccessAppointments',[PaymentsController::class, 'instaMOJOWebSuccessAppointments']);
    Route::get('payments/payPalPay', [PaymentsController::class, 'payPalPay']);
    Route::get('payments/razorPay', [PaymentsController::class, 'razorPay']);
    Route::get('payments/VerifyRazorPurchase', [PaymentsController::class, 'VerifyRazorPurchase']);
    Route::post('payments/capureRazorPay', [PaymentsController::class, 'capureRazorPay']);
    Route::post('payments/instamojoPay', [PaymentsController::class, 'instamojoPay']);
    Route::get('payments/flutterwavePay', [PaymentsController::class, 'flutterwavePay']);
    Route::get('payments/paystackPay', [PaymentsController::class, 'paystackPay']);
    Route::get('payments/payKunPay', [PaymentsController::class, 'payKunPay']);

    // Payments Routes For User Public
    Route::get('payNow',[PaytmPayController::class, 'payNow']);
    Route::get('payNowWeb',[PaytmPayController::class, 'payNowWeb']);
    Route::get('payProductWeb',[PaytmPayController::class, 'payProductWeb']);
    Route::post('paytm-callback',[PaytmPayController::class, 'paytmCallback']);
    Route::post('paytm-webCallback',[PaytmPayController::class, 'webCallback']);
    Route::post('paytm-webCallbackProduct',[PaytmPayController::class, 'webCallbackProduct']);
    Route::get('refundUserRequest',[PaytmPayController::class, 'refundUserRequest']);

    Route::post('pages/getContent', [PagesController::class, 'getById']);

    Route::post('stores/getNearMe', [StoresController::class, 'getNearMe']);

    Route::post('foods/getFoodsOrder', [FoodsController::class, 'getByCategories']);

    Route::post('sendVerificationOnMail', [UsersController::class, 'sendVerificationOnMail']);
    Route::post('users/create_user_account', [UsersController::class, 'create_user_account']);
    Route::post('users/verifyPhoneForFirebaseRegistrations', [UsersController::class, 'verifyPhoneForFirebaseRegistrations']);
    Route::post('users/verifyPhoneSignup', [UsersController::class, 'verifyPhoneSignup']);

    Route::post('stores/getStoreData', [StoresController::class, 'getStoreData']);

    Route::post('contacts/create',[ContactsController::class, 'save'] );
    Route::post('sendMailToAdmin',[ContactsController::class, 'sendMailToAdmin']);
    Route::get('stores/searchResult', [StoresController::class, 'searchResult']);

    Route::get('orders/printInvoice', [OrdersController::class, 'printInvoice']);
    Route::get('orders/printStatsDate', [OrdersController::class, 'printStatsDate']);

    Route::get('blogs/getTop', [BlogsController::class, 'getTop']);
    Route::post('blogs/getById', [BlogsController::class, 'getById']);
    Route::post('stores/getStoreReviews', [RatingController::class, 'getMyReviews']);
});
