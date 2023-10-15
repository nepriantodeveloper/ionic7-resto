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
use App\Models\Store;
use App\Models\User;
use App\Models\Settings;
use App\Models\General;
use App\Models\Banners;
use App\Models\Categories;
use Validator;
use DB;

class StoresController extends Controller
{
    public function save(Request $request){
        $validator = Validator::make($request->all(), [
            'uid' => 'required',
            'name' => 'required',
            'mobile' => 'required',
            'lat' => 'required',
            'lng' => 'required',
            'verified' => 'required',
            'address' => 'required',
            'descriptions' => 'required',
            'images' => 'required',
            'cover' => 'required',
            'commission' => 'required',
            'open_time' => 'required',
            'close_time' => 'required',
            'isClosed' => 'required',
            'certificate_url' => 'required',
            'certificate_type' => 'required',
            'rating' => 'required',
            'total_rating' => 'required',
            'cid' => 'required',
            'cusine' => 'required',
            'time' => 'required',
            'dish' => 'required',
        ]);
        if ($validator->fails()) {
            $response = [
                'success' => false,
                'message' => 'Validation Error.', $validator->errors(),
                'status'=> 500
            ];
            return response()->json($response, 404);
        }

        $data = Store::create($request->all());
        if (is_null($data)) {
            $response = [
            'data'=>$data,
            'message' => 'error',
            'status' => 500,
        ];
        return response()->json($response, 200);
        }
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

        $data = Store::find($request->id);

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
        $data = Store::find($request->id)->update($request->all());

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

    public function delete(Request $request){
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
        $data = Store::find($request->id);
        if ($data) {
            $data->delete();
            $response = [
                'data'=>$data,
                'success' => true,
                'status' => 200,
            ];
            return response()->json($response, 200);
        }
        $response = [
            'success' => false,
            'message' => 'Data not found.',
            'status' => 404
        ];
        return response()->json($response, 404);
    }

    public function getAll(){
        $data = DB::table('store')
                ->select('store.*','cities.name as city_name','users.first_name as first_name','users.last_name as last_name')
                ->join('cities','store.cid','cities.id')
                ->join('users','store.uid','users.id')
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
                            'uid' => $row['uid'],
                            'name' => $row['name'],
                            'mobile' => $row['mobile'],
                            'lat' => $row['lat'],
                            'lng' => $row['lng'],
                            'verified' => $row['verified'],
                            'address' => $row['address'],
                            'descriptions' => $row['descriptions'],
                            'images' => $row['images'],
                            'cover' => $row['cover'],
                            'commission' => $row['commission'],
                            'open_time' => $row['open_time'],
                            'close_time' => $row['close_time'],
                            'isClosed' => $row['isClosed'],
                            'certificate_url' => $row['certificate_url'],
                            'certificate_type' => $row['certificate_type'],
                            'rating' => $row['rating'],
                            'total_rating' => $row['total_rating'],
                            'cid' => $row['cid'],
                            'cusine' => $row['cusine'],
                            'time' => $row['time'],
                            'dish' => $row['dish'],
                            'status' => $row['status'],
                            'extra_field' => $row['extra_field'],
                        );
                        $checkLead  =  Store::where("id", "=", $row["id"])->first();
                        if (!is_null($checkLead)) {
                            DB::table('store')->where("id", "=", $row["id"])->update($insertInfo);
                        }
                        else {
                            DB::table('store')->insert($insertInfo);
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

    public function update_store_user(Request $request){
        $validator = Validator::make($request->all(), [
            'id' => 'required',
            'uid' => 'required'
        ]);
        if ($validator->fails()) {
            $response = [
                'success' => false,
                'message' => 'Validation Error.', $validator->errors(),
                'status'=> 500
            ];
            return response()->json($response, 404);
        }
        $data = Store::find($request->id)->update($request->all());
        $data2 = User::find($request->uid)->update(['cover'=>$request->cover]);
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

    public function getNearMe(Request $request){
        $validator = Validator::make($request->all(), [
            'lat' => 'required',
            'lng' => 'required',
        ]);
        if ($validator->fails()) {
            $response = [
                'success' => false,
                'message' => 'Validation Error.', $validator->errors(),
                'status'=> 500
            ];
            return response()->json($response, 404);
        }
        $searchQuery = Settings::select('allowDistance','searchResultKind')->first();

        if($searchQuery->searchResultKind == 1){
            $values = 3959; // miles
            $distanceType = 'miles';
        }else{
            $values = 6371; // km
            $distanceType = 'km';
        }
        \DB::enableQueryLog();
        $data = Store::select(DB::raw('store.*, ( '.$values.' * acos( cos( radians('.$request->lat.') ) * cos( radians( lat ) ) * cos( radians( lng ) - radians('.$request->lng.') ) + sin( radians('.$request->lat.') ) * sin( radians( lat ) ) ) ) AS distance'))
        ->having('distance', '<', (int)$searchQuery->allowDistance)
        ->orderBy('distance')
        ->where(['store.status'=>1])
        ->get();

        foreach($data as $loop){
            $loop->distance = round($loop->distance,2);
        }
        $storeIds  = Store::select('uid')->where(['status'=>1])->pluck('uid')->all();
        $banners = Banners::WhereIn('value',$storeIds)->where('status',1)->orWhere('type',1)->get();
        $response = [
            'data'=>$data,
            'distanceType'=>$distanceType,
            'banners'=>$banners,
            'success' => true,
            'status' => 200,
            'havedata'=>true,
        ];
        return response()->json($response, 200);
    }

    public function getOrderInfo(Request $request){
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

        $data = Store::where('uid',$request->id)->first();
        $categories = Categories::where('restId',$request->id)->get();
        $storeOwner = DB::table('users')->select('id','first_name','last_name','email','fcm_token','mobile','country_code')->where("id", "=", $data->uid)->first();
        $response = [
            'data'=>$data,
            'categories'=>$categories,
            'storeOwner'=>$storeOwner,
            'success' => true,
            'status' => 200,
        ];
        return response()->json($response, 200);
    }

    public function getStoreData(Request $request){
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

        $data = Store::where('uid',$request->id)->first();
        $categories = Categories::where('restId',$request->id)->get();
        $response = [
            'data'=>$data,
            'categories'=>$categories,
            'success' => true,
            'status' => 200,
        ];
        return response()->json($response, 200);
    }

    public function searchResult(Request $request){
        $str = "";
        if ($request->has('param') && $request->has('lat') && $request->has('lng')) {
            $str = $request->param;
            $lat = $request->lat;
            $lng = $request->lng;
        }

        $searchQuery = Settings::select('allowDistance','searchResultKind')->first();

        if($searchQuery->searchResultKind == 1){
            $values = 3959; // miles
            $distanceType = 'miles';
        }else{
            $values = 6371; // km
            $distanceType = 'km';
        }
        \DB::enableQueryLog();
        $data = Store::select(DB::raw('store.*, ( '.$values.' * acos( cos( radians('.$request->lat.') ) * cos( radians( lat ) ) * cos( radians( lng ) - radians('.$request->lng.') ) + sin( radians('.$request->lat.') ) * sin( radians( lat ) ) ) ) AS distance'))
        ->having('distance', '<', (int)$searchQuery->allowDistance)
        ->orderBy('distance')
        ->where('store.name', 'like', '%'.$str.'%')
        ->where(['store.status'=>1])
        ->get();

        foreach($data as $loop){
            $loop->distance = round($loop->distance,2);
        }
        $response = [
            'data'=>$data,
            'distanceType'=>$distanceType,
            'success' => true,
            'status' => 200,
            'havedata'=>true,
        ];
        return response()->json($response, 200);
    }
}
