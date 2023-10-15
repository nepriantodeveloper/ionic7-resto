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
use App\Models\Rating;
use App\Models\Store;
use App\Models\User;
use App\Models\Foods;
use App\Models\Drivers;
use Validator;
use DB;

class RatingController extends Controller
{
    public function save(Request $request){
        $validator = Validator::make($request->all(), [
            'uid' => 'required',
            'pid' => 'required',
            'did' => 'required',
            'sid' => 'required',
            'rate' => 'required',
            'msg' => 'required',
            'way' => 'required',
        ]);
        if ($validator->fails()) {
            $response = [
                'success' => false,
                'message' => 'Validation Error.', $validator->errors(),
                'status'=> 500
            ];
            return response()->json($response, 404);
        }

        $data = Rating::create($request->all());
        Store::where('uid',$request->sid)->update(['rating'=>$request->rating,'total_rating'=>$request->total_rating]);
        $response = [
            'data'=>$data,
            'success' => true,
            'status' => 200,
        ];
        return response()->json($response, 200);
    }

    public function getStoreRatings(Request $request){
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

        $data = Rating::where('sid',$request->id)->select('sid','rate')->get();

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

    public function getProductsReview(Request $request){
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

        $data = Rating::where('pid',$request->id)->select('pid','rate')->get();

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

    public function save_product_review(Request $request){
        $validator = Validator::make($request->all(), [
            'uid' => 'required',
            'pid' => 'required',
            'did' => 'required',
            'sid' => 'required',
            'rate' => 'required',
            'msg' => 'required',
            'way' => 'required',
        ]);
        if ($validator->fails()) {
            $response = [
                'success' => false,
                'message' => 'Validation Error.', $validator->errors(),
                'status'=> 500
            ];
            return response()->json($response, 404);
        }

        $data = Rating::create($request->all());
        Foods::where('id',$request->pid)->update(['rating'=>$request->rating]);
        $response = [
            'data'=>$data,
            'success' => true,
            'status' => 200,
        ];
        return response()->json($response, 200);
    }

    public function save_driver_review(Request $request){
        $validator = Validator::make($request->all(), [
            'uid' => 'required',
            'pid' => 'required',
            'did' => 'required',
            'sid' => 'required',
            'rate' => 'required',
            'msg' => 'required',
            'way' => 'required',
        ]);
        if ($validator->fails()) {
            $response = [
                'success' => false,
                'message' => 'Validation Error.', $validator->errors(),
                'status'=> 500
            ];
            return response()->json($response, 404);
        }

        $data = Rating::create($request->all());
        $response = [
            'data'=>$data,
            'success' => true,
            'status' => 200,
        ];
        return response()->json($response, 200);
    }

    public function getMyReviews(Request $request){
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
        $data = DB::table('rating')
                ->select('rating.*','users.first_name as first_name','users.last_name as last_name','users.cover as cover')
                ->join('users','rating.uid','users.id')
                ->where('rating.sid',$request->id)
                ->orderBy('rating.id','desc')
                ->get();

        $response = [
            'data'=>$data,
            'success' => true,
            'status' => 200,
        ];
        return response()->json($response, 200);
    }

    public function getDriversReviews(Request $request){
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
        $data = DB::table('rating')
                ->select('rating.*','users.first_name as first_name','users.last_name as last_name','users.cover as cover')
                ->join('users','rating.uid','users.id')
                ->where('rating.did',$request->id)
                ->orderBy('rating.id','desc')
                ->get();

        $response = [
            'data'=>$data,
            'success' => true,
            'status' => 200,
        ];
        return response()->json($response, 200);
    }

    public function getAll(Request $request){
        $data = Rating::get();
        foreach($data as $loop){
            if($loop && $loop->pid && $loop->pid != null && $loop->pid != 0){
                $loop->productInfo = Foods::where('id',$loop->pid)->select('name','cover')->first();
            }

            if($loop && $loop->sid && $loop->sid != null && $loop->sid != 0){
                $loop->storeInfo = Store::where('uid',$loop->sid)->select('name','cover')->first();
            }

            if($loop && $loop->did && $loop->did != null && $loop->did != 0){
                $loop->driverInfo = Drivers::where('id',$loop->did)->select('first_name','last_name','cover')->first();
            }

            if($loop && $loop->uid && $loop->uid != null && $loop->uid != 0){
                $loop->userInfo = User::where('id',$loop->uid)->select('first_name','last_name','cover')->first();
            }
        }

        $response = [
            'data' => $data,
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
                            'uid' => $row['uid'],
                            'pid' => $row['pid'],
                            'did' => $row['did'],
                            'sid' => $row['sid'],
                            'rate' => $row['rate'],
                            'msg' => $row['msg'],
                            'way' => $row['way'],
                            'status' => $row['status'],
                        );
                        $checkLead  =  Rating::where("id", "=", $row["id"])->first();
                        if (!is_null($checkLead)) {
                            DB::table('rating')->where("id", "=", $row["id"])->update($insertInfo);
                        }
                        else {
                            DB::table('rating')->insert($insertInfo);
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
}
