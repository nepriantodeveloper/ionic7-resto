<?php
/*
  Authors : initappz (Rahul Jograna)
  Website : https://initappz.com/
  App Name : Food Delivery Ionic 7 And Laravel
  This App Template Source code is licensed as per the
  terms found in the Website https://initappz.com/license
  Copyright and Good Faith Purchasers © 2023-present initappz.
*/
namespace App\Http\Controllers\v1;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Orders;
use App\Models\User;
use App\Models\Store;
use App\Models\Foods;
use App\Models\Settings;
use App\Models\Drivers;
use App\Models\Address;
use App\Models\Rating;
use App\Models\General;
use Carbon\Carbon;
use Validator;
use DB;

class OrdersController extends Controller
{
    public function save(Request $request){
        $validator = Validator::make($request->all(), [
            'address' => 'required',
            'applied_coupon' => 'required',
            'coupon_id' => 'required',
            'delivery_charge' => 'required',
            'discount' => 'required',
            'grand_total' => 'required',
            'orders' => 'required',
            'paid' => 'required',
            'pay_method' => 'required',
            'restId' => 'required',
            'serviceTax' => 'required',
            'time' => 'required',
            'total' => 'required',
            'wallet_used' => 'required',
            'wallet_price' => 'required',
            'uid' => 'required',
            'status' => 'required',
            'extra_field' => 'required',
        ]);
        if ($validator->fails()) {
            $response = [
                'success' => false,
                'message' => 'Validation Error.', $validator->errors(),
                'status'=> 500
            ];
            return response()->json($response, 404);
        }

        $data = Orders::create($request->all());
        if (is_null($data)) {
            $response = [
            'data'=>$data,
            'message' => 'error',
            'status' => 500,
        ];
        return response()->json($response, 200);
        }
        if($request && $request->wallet_used == 1){
            $redeemer = User::where('id',$request->uid)->first();
            $redeemer->withdraw($request->wallet_price);
        }
        $response = [
            'data'=>$data,
            'success' => true,
            'status' => 200,
        ];
        return response()->json($response, 200);
    }

    public function getMyOrders(Request $request){
        $validator = Validator::make($request->all(), [
            'id' => 'required',
        ]);
        if ($validator->fails()) {
            $response = [
                'success' => false,
                'message' => 'Validation Error.', $validator->errors(),
                'status'=> 500
            ];
            return response()->json($response, 404);
        }

        $data = DB::table('orders')
                ->select('orders.*','store.name as store_name','store.cover as store_cover','store.address as store_address')
                ->join('store','orders.restId','store.uid')
                ->orderBy('orders.id','desc')
                ->where('orders.uid',$request->id)
                ->get();

        $response = [
            'data'=>$data,
            'success' => true,
            'status' => 200,
        ];
        return response()->json($response, 200);
    }

    public function getUserOrders(Request $request){
        $validator = Validator::make($request->all(), [
            'id' => 'required',
        ]);
        if ($validator->fails()) {
            $response = [
                'success' => false,
                'message' => 'Validation Error.', $validator->errors(),
                'status'=> 500
            ];
            return response()->json($response, 404);
        }

        $data = DB::table('orders')
                ->select('orders.*','users.first_name as first_name','users.last_name as last_name','users.cover as user_cover')
                ->join('users','orders.uid','users.id')
                ->orderBy('orders.id','desc')
                ->where('orders.restId',$request->id)
                ->get();

        $response = [
            'data'=>$data,
            'success' => true,
            'status' => 200,
        ];
        return response()->json($response, 200);
    }

    public function getById(Request $request){
        $validator = Validator::make($request->all(), [
            'id' => 'required',
        ]);
        if ($validator->fails()) {
            $response = [
                'success' => false,
                'message' => 'Validation Error.', $validator->errors(),
                'status'=> 500
            ];
            return response()->json($response, 404);
        }

        $data = DB::table('orders')
                ->select('orders.*','store.name as store_name','store.cover as store_cover','store.address as store_address','users.fcm_token as store_fcm_token','users.mobile as store_mobile')
                ->join('store','orders.restId','store.uid')
                ->join('users','orders.restId','users.id')
                ->where('orders.id',$request->id)
                ->first();
        $response = [
            'data'=>$data,
            'success' => true,
            'status' => 200,
        ];
        return response()->json($response, 200);
    }

    public function update(Request $request){
        $validator = Validator::make($request->all(), [
            'id' => 'required',
        ]);
        if ($validator->fails()) {
            $response = [
                'success' => false,
                'message' => 'Validation Error.', $validator->errors(),
                'status'=> 500
            ];
            return response()->json($response, 404);
        }
        $data = Orders::find($request->id)->update($request->all());

        if (is_null($data)) {
            $response = [
                'success' => false,
                'message' => 'Data not found.',
                'status' => 404
            ];
            return response()->json($response, 404);
        }
        $response = [
            'data'=>$data,
            'success' => true,
            'status' => 200,
        ];
        return response()->json($response, 200);
    }

    public function getUserOrderById(Request $request){
        $validator = Validator::make($request->all(), [
            'id' => 'required',
        ]);
        if ($validator->fails()) {
            $response = [
                'success' => false,
                'message' => 'Validation Error.', $validator->errors(),
                'status'=> 500
            ];
            return response()->json($response, 404);
        }

        $data = DB::table('orders')
                ->select('orders.*','users.fcm_token as user_fcm_token','users.mobile as user_mobile','users.email as user_email','users.first_name as first_name','users.last_name as last_name',
                        'users.cover as user_cover')
                ->join('users','orders.uid','users.id')
                ->where('orders.id',$request->id)
                ->first();
        $response = [
            'data'=>$data,
            'success' => true,
            'status' => 200,
        ];
        return response()->json($response, 200);
    }

    public function completeOrder(Request $request){
        $validator = Validator::make($request->all(), [
            'id' => 'required',
            'did' => 'required',
            'status' => 'required',
        ]);
        if ($validator->fails()) {
            $response = [
                'success' => false,
                'message' => 'Validation Error.', $validator->errors(),
                'status'=> 500
            ];
            return response()->json($response, 404);
        }
        $data = Orders::find($request->id)->update($request->all());
        Drivers::find($request->did)->update(['current'=>'active']);
        if (is_null($data)) {
            $response = [
                'success' => false,
                'message' => 'Data not found.',
                'status' => 404
            ];
            return response()->json($response, 404);
        }
        $response = [
            'data'=>$data,
            'success' => true,
            'status' => 200,
        ];
        return response()->json($response, 200);
    }

    public function acceptOrder(Request $request){
        $validator = Validator::make($request->all(), [
            'id' => 'required',
            'did' => 'required',
            'status' => 'required',
        ]);
        if ($validator->fails()) {
            $response = [
                'success' => false,
                'message' => 'Validation Error.', $validator->errors(),
                'status'=> 500
            ];
            return response()->json($response, 404);
        }
        $data = Orders::find($request->id)->update($request->all());
        Drivers::find($request->did)->update(['current'=>'busy']);
        if (is_null($data)) {
            $response = [
                'success' => false,
                'message' => 'Data not found.',
                'status' => 404
            ];
            return response()->json($response, 404);
        }
        $response = [
            'data'=>$data,
            'success' => true,
            'status' => 200,
        ];
        return response()->json($response, 200);
    }

    public function printInvoice(Request $request){
        $validator = Validator::make($request->all(), [
            'id'     => 'required',
            'token'  => 'required',
        ]);
        if ($validator->fails()) {
            $response = [
                'success' => false,
                'message' => 'Validation Error.', $validator->errors(),
                'status'=> 500
            ];
            return response()->json($response, 404);
        }

        try {
            $data = DB::table('orders')
            ->select('orders.*','users.first_name as user_first_name','users.last_name as user_last_name','users.cover as user_cover','users.fcm_token as user_fcm_token','users.mobile as user_mobile','users.email as user_email')
            ->join('users', 'orders.uid', '=', 'users.id')
            ->where('orders.id',$request->id)
            ->first();
            $settings = Settings::first();
            $general = General::first();
            $addres ='';
            $compressed = json_decode($data->address);
            $addres = $compressed->house .' '.$compressed->landmark .' '.$compressed->address .' '.$compressed->pincode;
            $data->orders = json_decode($data->orders);
            $response = [
                'data'=>$data,
                'email'=>$general->email,
                'delivery'=>$addres,
                'currencySymbol'=>$settings->currencySymbol
            ];
            // echo json_encode($data);
            $mail = $data->user_email;
            $username = $data->user_first_name;
            return view('printinvoice',$response);
        } catch (TokenExpiredException $e) {

            return response()->json(['error' => 'Session Expired.', 'status_code' => 401], 401);

        } catch (TokenInvalidException $e) {

            return response()->json(['error' => 'Token invalid.', 'status_code' => 401], 401);

        } catch (JWTException $e) {

            return response()->json(['token_absent' => $e->getMessage()], 401);

        }
    }

    public function getStatsByDate(Request $request){
        $validator = Validator::make($request->all(), [
            'id' => 'required',
            'from' => 'required',
            'end' => 'required',
        ]);
        if ($validator->fails()) {
            $response = [
                'success' => false,
                'message' => 'Validation Error.', $validator->errors(),
                'status'=> 500
            ];
            return response()->json($response, 404);
        }

        $from = date($request->from);
        $to = date($request->end);

        $data = DB::table('orders')
                ->select('orders.*','users.first_name as first_name','users.last_name as last_name','users.cover as user_cover')
                ->join('users','orders.uid','users.id')
                ->orderBy('orders.id','desc')
                ->where(['orders.restId'=>$request->id,'orders.status'=>'delivered'])
                ->whereBetween('orders.created_at', [$from, $to])
                ->get();

        $response = [
            'data'=>$data,
            'success' => true,
            'commission'=>DB::table('store')->select('commission')->where('uid',$request->id)->first(),
            'status' => 200,
        ];
        return response()->json($response, 200);
    }

    public function printStatsDate(Request $request){
        $validator = Validator::make($request->all(), [
            'id' => 'required',
            'from' => 'required',
            'end' => 'required',
            'from_date' => 'required',
            'end_date' => 'required',
            'total' => 'required',
            'commission' => 'required',
            'amount_received' => 'required',
        ]);
        if ($validator->fails()) {
            $response = [
                'success' => false,
                'message' => 'Validation Error.', $validator->errors(),
                'status'=> 500
            ];
            return response()->json($response, 404);
        }

        $from = date($request->from);
        $to = date($request->end);
        $settings = Settings::first();
        $general = General::first();
        $addres = $general->address .' '.$general->city .' '.$general->state .' '.$general->country .' '.$general->zip;
        $data = DB::table('orders')
                ->select('orders.*','users.first_name as first_name','users.last_name as last_name','users.cover as user_cover')
                ->join('users','orders.uid','users.id')
                ->orderBy('orders.id','desc')
                ->where(['orders.restId'=>$request->id,'orders.status'=>'delivered'])
                ->whereBetween('orders.created_at', [$from, $to])
                ->get();

        foreach($data as $loop){
            $loop->orders = json_decode($loop->orders);
        }
        // echo json_encode($data);
        $response = [
            'data'=>$data,
            'email'=>$general->email,
            'name'=>$general->name,
            'address'=>$addres,
            'currencySymbol'=>$settings->currencySymbol,
            'from_date'=>$request->from_date,
            'end_date'=>$request->end_date,
            'total'=>$request->total,
            'commission'=>$request->commission,
            'amount_received'=>$request->amount_received,
        ];
        return view('orderstats',$response);
    }

    public function getDriverOrders(Request $request){
        $validator = Validator::make($request->all(), [
            'id' => 'required',
        ]);
        if ($validator->fails()) {
            $response = [
                'success' => false,
                'message' => 'Validation Error.', $validator->errors(),
                'status'=> 500
            ];
            return response()->json($response, 404);
        }

        $data = DB::table('orders')
                ->select('orders.*','users.first_name as first_name','users.last_name as last_name','users.cover as user_cover','store.name as store_name','store.address as store_address','store.cover as store_cover')
                ->join('users','orders.uid','users.id')
                ->join('store','orders.restId','store.uid')
                ->orderBy('orders.id','desc')
                ->where('orders.did',$request->id)
                ->get();

        $response = [
            'data'=>$data,
            'success' => true,
            'status' => 200,
        ];
        return response()->json($response, 200);
    }

    public function getDriverOrderById(Request $request){
        $validator = Validator::make($request->all(), [
            'id' => 'required',
        ]);
        if ($validator->fails()) {
            $response = [
                'success' => false,
                'message' => 'Validation Error.', $validator->errors(),
                'status'=> 500
            ];
            return response()->json($response, 404);
        }

        $data = DB::table('orders')
                ->select('orders.*','users.first_name as first_name','users.last_name as last_name','users.cover as user_cover','users.email as user_email',
                'users.country_code as user_country_code','users.mobile as user_mobile','users.fcm_token as user_fcm_token','store.name as store_name','store.address as store_address','store.cover as store_cover','store_user.fcm_token as store_fcm_token')
                ->join('users','orders.uid','users.id')
                ->join('store','orders.restId','store.uid')
                ->join('users as store_user','orders.restId','store_user.id')
                ->where('orders.id',$request->id)
                ->first();

        $response = [
            'data'=>$data,
            'success' => true,
            'status' => 200,
        ];
        return response()->json($response, 200);
    }

    public function allOrders(Request $request){
        $data = DB::table('orders')
                ->select('orders.*','users.first_name as first_name','users.last_name as last_name','users.cover as user_cover','store.name as store_name','store.cover as store_cover','store.address as store_address')
                ->join('users','orders.uid','users.id')
                ->join('store','orders.restId','store.uid')
                ->orderBy('orders.id','desc')
                ->get();

        $response = [
            'data'=>$data,
            'success' => true,
            'status' => 200,
        ];
        return response()->json($response, 200);
    }

    public function importData(Request $request){
        $request->validate([
            "csv_file" => "required",
        ]);
        $file = $request->file("csv_file");
        $csvData = file_get_contents($file);
        $rows = array_map("str_getcsv", explode("\n", $csvData));
        $header = array_shift($rows);
        foreach ($rows as $row) {
            if (isset($row[0])) {
                if ($row[0] != "") {

                    if(count($header) == count($row)){
                        $row = array_combine($header, $row);
                        $insertInfo =  array(
                            'id' => $row['id'],
                            'address' => $row['address'],
                            'applied_coupon' => $row['applied_coupon'],
                            'coupon_id' => $row['coupon_id'],
                            'did' => $row['did'],
                            'delivery_charge' => $row['delivery_charge'],
                            'discount' => $row['discount'],
                            'grand_total' => $row['grand_total'],
                            'orders' => $row['orders'],
                            'paid' => $row['paid'],
                            'pay_method' => $row['pay_method'],
                            'restId' => $row['restId'],
                            'serviceTax' => $row['serviceTax'],
                            'time' => $row['time'],
                            'total' => $row['total'],
                            'uid' => $row['uid'],
                            'notes' => $row['notes'],
                            'status' => $row['status'],
                        );
                        $checkLead  =  Orders::where("id", "=", $row["id"])->first();
                        if (!is_null($checkLead)) {
                            DB::table('orders')->where("id", "=", $row["id"])->update($insertInfo);
                        }
                        else {
                            DB::table('orders')->insert($insertInfo);
                        }
                    }
                }
            }
        }
        $response = [
            'data'=>'Done',
            'success' => true,
            'status' => 200,
        ];
        return response()->json($response, 200);
    }

    public function getOrderDetailsAdmin(Request $request){
        $validator = Validator::make($request->all(), [
            'id' => 'required',
        ]);
        if ($validator->fails()) {
            $response = [
                'success' => false,
                'message' => 'Validation Error.', $validator->errors(),
                'status'=> 500
            ];
            return response()->json($response, 404);
        }

        $data = DB::table('orders')
                ->select('orders.*','store.name as store_name','store.cover as store_cover','store.address as store_address','users.fcm_token as store_fcm_token','users.mobile as store_mobile','store_user.first_name as user_first_name','store_user.last_name as user_last_name','store_user.cover as user_cover','store_user.fcm_token as user_fcm_token')
                ->join('store','orders.restId','store.uid')
                ->join('users','orders.restId','users.id')
                ->join('users as store_user','orders.uid','store_user.id')
                ->where('orders.id',$request->id)
                ->first();
        $response = [
            'data'=>$data,
            'success' => true,
            'status' => 200,
        ];
        return response()->json($response, 200);
    }

    public function getDashboard(Request $request){
        $now = Carbon::now();

        $todatData = Orders::select(\DB::raw("COUNT(*) as count"), \DB::raw("DATE_FORMAT(created_at,'%h:%m') as day_name"), \DB::raw("DATE_FORMAT(created_at,'%h:%m') as day"))
        ->whereDate('created_at',Carbon::today())
        ->groupBy('day_name','day')
        ->orderBy('day')
        ->get();

        $weekData = Orders::select(\DB::raw("COUNT(*) as count"), \DB::raw("DATE(created_at) as day_name"), \DB::raw("DATE(created_at) as day"))
            ->whereBetween('created_at', [Carbon::now()->startOfWeek(), Carbon::now()->endOfWeek()])
            ->groupBy('day_name','day')
            ->orderBy('day')
            ->get();

        $monthData = Orders::select(\DB::raw("COUNT(*) as count"), \DB::raw("DATE(created_at) as day_name"), \DB::raw("DATE(created_at) as day"))
            ->whereMonth('created_at', Carbon::now()->month)
            ->groupBy('day_name','day')
            ->orderBy('day')
            ->get();
        $monthResponse = [];
        $weekResponse =[];
        $todayResponse = [];

        foreach($todatData as $row) {
            $todayResponse['label'][] = $row->day_name;
            $todayResponse['data'][] = (int) $row->count;
        }
        foreach($weekData as $row) {
            $weekResponse['label'][] = $row->day_name;
            $weekResponse['data'][] = (int) $row->count;
        }

        foreach($monthData as $row) {
            $monthResponse['label'][] = $row->day_name;
            $monthResponse['data'][] = (int) $row->count;
        }

        $todayDate  = $now->format('d F');

        $weekStartDate = $now->startOfWeek()->format('d');
        $weekEndDate = $now->endOfWeek()->format('d F');

        $monthStartDate = $now->startOfMonth()->format('d');
        $monthEndDate = $now->endOfMonth()->format('d F');


        $recentOrders = DB::table('orders')
                ->select('orders.*','users.first_name as first_name','users.last_name as last_name','users.cover as user_cover','store.name as store_name','store.cover as store_cover','store.address as store_address')
                ->join('users','orders.uid','users.id')
                ->join('store','orders.restId','store.uid')
                ->orderBy('orders.id','desc')
                ->limit(10)
                ->get();

        $recentUsers = User::where('type','user')->limit(10)->orderBy('id','desc')->get();

        $response = [
            'today' => $todayResponse,
            'week' => $weekResponse,
            'month' => $monthResponse,
            'todayLabel' => $todayDate,
            'weekLabel' => $weekStartDate . '-'. $weekEndDate,
            'monthLabel' => $monthStartDate.'-'.$monthEndDate,
            'recentOrders'=>$recentOrders,
            'orders'=>Orders::count(),
            'users'=>User::where('type','user')->count(),
            'store'=>Store::count(),
            'foods'=>Foods::count(),
            'recentUsers'=>$recentUsers,
            'success' => true,
            'status' => 200,
        ];
        return response()->json($response, 200);
    }

    public function userProfileAdmin(Request $request){
        $validator = Validator::make($request->all(), [
            'id' => 'required',
        ]);
        if ($validator->fails()) {
            $response = [
                'success' => false,
                'message' => 'Validation Error.', $validator->errors(),
                'status'=> 500
            ];
            return response()->json($response, 404);
        }
        $data = User::find($request->id);
        if($data && $data->balance){
            $data['balance'] = $data->balance;
        }
        $orders =  DB::table('orders')
                    ->select('orders.*','store.name as store_name','store.cover as store_cover','store.address as store_address')
                    ->join('store','orders.restId','store.uid')
                    ->orderBy('orders.id','desc')
                    ->where('orders.uid',$request->id)
                    ->get();

        $reviews = Rating::where('uid',$request->id)->get();
        foreach($reviews as $loop){
            if($loop && $loop->pid && $loop->pid != null && $loop->pid != 0){
                $loop->productInfo = Foods::where('id',$loop->pid)->select('name','cover')->first();
            }

            if($loop && $loop->sid && $loop->sid != null && $loop->sid != 0){
                $loop->storeInfo = Store::where('uid',$loop->sid)->select('name','cover')->first();
            }

            if($loop && $loop->did && $loop->did != null && $loop->did != 0){
                $loop->driverInfo = Drivers::where('id',$loop->did)->select('first_name','last_name','cover')->first();
            }
        }

        $response = [
            'data' => $data,
            'address' => Address::where('uid',$request->id)->get(),
            'orders' => $orders,
            'reviews' => $reviews,
            'success' => true,
            'status' => 200,
        ];
        return response()->json($response, 200);
    }

    public function driverProfileAdmin(Request $request){
        $validator = Validator::make($request->all(), [
            'id' => 'required',
        ]);
        if ($validator->fails()) {
            $response = [
                'success' => false,
                'message' => 'Validation Error.', $validator->errors(),
                'status'=> 500
            ];
            return response()->json($response, 404);
        }
        $data = Drivers::find($request->id);

        $orders =  DB::table('orders')
                    ->select('orders.*','store.name as store_name','store.cover as store_cover','store.address as store_address','users.first_name as first_name','users.last_name as last_name','users.cover as user_cover')
                    ->join('store','orders.restId','store.uid')
                    ->join('users','orders.uid','users.id')
                    ->orderBy('orders.id','desc')
                    ->where('orders.did',$request->id)
                    ->get();

        $reviews = Rating::where('did',$request->id)->get();
        foreach($reviews as $loop){
            if($loop && $loop->uid && $loop->uid != null && $loop->uid != 0){
                $loop->userInfo = User::where('id',$loop->uid)->select('first_name','last_name','cover')->first();
            }
        }

        $response = [
            'data' => $data,
            'orders' => $orders,
            'reviews' => $reviews,
            'success' => true,
            'status' => 200,
        ];
        return response()->json($response, 200);
    }

    public function getDriverStatsAdmin(Request $request){
        $validator = Validator::make($request->all(), [
            'id' => 'required',
            'from' => 'required',
            'end' => 'required',
        ]);
        if ($validator->fails()) {
            $response = [
                'success' => false,
                'message' => 'Validation Error.', $validator->errors(),
                'status'=> 500
            ];
            return response()->json($response, 404);
        }

        $from = date($request->from);
        $to = date($request->end);

        $data = DB::table('orders')
                ->select('orders.*','users.first_name as first_name','users.last_name as last_name','users.cover as user_cover')
                ->join('users','orders.uid','users.id')
                ->orderBy('orders.id','desc')
                ->where(['orders.did'=>$request->id,'orders.status'=>'delivered'])
                ->whereBetween('orders.created_at', [$from, $to])
                ->get();

        $response = [
            'data'=>$data,
            'success' => true,
            'status' => 200,
        ];
        return response()->json($response, 200);
    }
}
