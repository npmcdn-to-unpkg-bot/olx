

var Container = React.createClass({
	getInitialState:function()
		{
		return {
		adverts:[],  //be empty, until new data from ajax
		//below is object for editin (passed to add advert).	
		//such construction makes possible mutually changing one object, because child obtain pointer to object and can access and change its properties
		def_advert :{'shared_obj':'take_internal'} 

		}

	
		},

	//when view makes first start - get adverts
	componentDidMount:function()
		{
		this.get_adverts();
		},


	//obtain all adverts from database
	get_adverts:function()
		{
		this.state.spinner = true;
		this.forceUpdate();
		$.ajax({
		   url:'./api/advert/get',
		   dataType:'json',
		   cashe:false,
		   method:'GET',
		   success:function(data)
			{
			this.state.spinner = false; //hide spinner
			this.state.adverts = data;
			setTimeout(function(){this.forceUpdate()}.bind(this),800);
			}.bind(this),
		   error:function(xhr,status,err)
			{
			this.state.spinner = false;
			this.forceUpdate();
			alert('Something happened wrong when obtaining adverts from database! '+err);
			}.bind(this)

		   })	

		},

	//this methods will be calling from bottom(child) classes
	//to make possible change adverts list and make re-render of entire view (all components)
	remove_advert:function(idx)
		{
		var d = {};
		d['data'] = {'id':idx};
		this.state.spinner = true;
		this.forceUpdate();
		$.post({
		   url:'./api/advert/remove',
		   data:d,
		   dataType:'json',
		   ContentType:'application/json; charset=utf-8',
		   cashe:false,
		   success:function(data)
			{
			this.state.spinner = false; //hide spinner
			this.state.adverts = this.state.adverts.filter(function(el){return el['id']!=idx});
			setTimeout(function(){this.forceUpdate()}.bind(this),800);
			}.bind(this),  //bind is necc to save context
		   error:function(xhr,status,err)
			{
			this.state.spinner = false;
			this.forceUpdate();
			alert('Something happened wrong when obtaining adverts from database! '+err);
			}.bind(this)

		   })	

			
		},

	//it is serving not only creating new advert, but updating also
	add_advert:function(obj)
		{
		var d = {};
		d['data'] = obj;
		d['data']['DateTs'] = parseInt((new Date()).getTime()/1000);  //set new Date (when created)
		d['data']['Date'] = (new Date(d['data']['DateTs']*1000)).toLocaleString();
		
		var url = obj['id']==''?'./api/advert/add':'./api/advert/update';

		this.state.spinner = true;
		this.forceUpdate();
		$.post({
		   url:url,
		   data:d,
		   dataType:'json',
		   ContentType:'application/json; charset=utf-8',
		   cashe:false,
		   success:function(data)
			{
			this.state.spinner = false; //hide spinner
			//if advert was added - add to list, if updated - substitude
			if (obj['id']=='')  //created adver
				{
				//returned id insert into newly created object and push it to array
				obj['id'] = data['id'];
				this.state.adverts.push($.extend(true,{},obj));
				}
			else  //updated
				{
				var t = this.state.adverts.filter(function(el){return el['id']==obj['id']})[0];
				$.extend(true,t,obj);
				}
	
			setTimeout(function(){this.forceUpdate()}.bind(this),800);


			}.bind(this),  //bind is necc to save context
		   error:function(xhr,status,err)
			{
			this.state.spinner = false;
			this.forceUpdate();
			alert('Something happened wrong when obtaining adverts from database! '+err);
			}.bind(this)

		   })	

			
		},

	update_advert:function(idx)
		{
		var clone_obj = this.state.adverts.filter(function(el){return el['id']==idx})[0];
		this.state.def_advert['shared_obj'] = $.extend(true,{},clone_obj);
		this.forceUpdate();
		},


	render:function()
		{
		//create dictionary with pointers to methods. It will be declining down to every child
		//Aim - from child change adverts array (by calling particular method) and re-render view
		var methods = {};
		methods['remove_advert'] = this.remove_advert;
		methods['update_advert'] = this.update_advert;
		methods['add_advert'] = this.add_advert;
	
		return (
		<div className="main_container">
			<Spinner show={this.state.spinner}/>
			<AddAdvert methods={methods} def_advert={this.state.def_advert}/>			
			<ListAdverts data={this.state.adverts} methods={methods}/>
		</div>
		
		)}


	})



var AddAdvert = React.createClass({
	getInitialState:function()
		{
		return {
		adver_obj:false,

		//options
		options:
		  {
		  'Categories':['Food','Clothes','For Auto','Gadgets'],
		  'Age':['Brandnew','1 year old', '2 years old','3 years old', '3+ years old'],
		  'State':['Perfect', 'Good', 'Singificanlty used', 'Not working']
		  }

		}},

	init_obj:function()
		{
		return {
		//object which will be send to backend
		  'id':'',
		  'Category': '',
		  'Age':'',
		  'State':'',
		  'Date':'',
		  'Price':'',
		  'Description':'',
		  'Title':''
		  }


		},

	cancel:function()
		{
		this.state.adver_obj = this.init_obj();
//		debugger;
		this.props.def_advert['shared_obj'] = 'take_internal';
		this.forceUpdate();
		},

	//handler firing when ONSELECT
	select:function(section,e)
		{
		this.state.adver_obj[section] = e.currentTarget.value;
		this.forceUpdate();
		},

	//returns true or false depens on completed all field in add advert form or not
	//using to determine disabled or not button
	is_disable:function()
		{
		for (var each in this.state.adver_obj)
			{
			if (this.state.adver_obj[each]==''&&each!='Date'&&each!='id')
				{
				return true;
				}	
			}
		return false;
		},

	save:function(e)
		{
		this.props.methods.add_advert(this.state.adver_obj);
		this.state.adver_obj = this.init_obj();
		this.props.def_advert['shared_obj'] = 'take_internal';  //reset object
		},

	render: function()
		{
		this.state.adver_obj = this.props.def_advert['shared_obj']=='take_internal'?(!this.state.adver_obj?this.init_obj():this.state.adver_obj):this.props.def_advert['shared_obj'];
		//complete CATEGORIES 
		var categories = this.state.options['Categories'].map(
		   function(el,idx){
			return <option key={idx} value={el}>{el}</option>
		    });
		//complete AGE
		var ages = this.state.options['Age'].map(
		   function(el,idx){
			return <option key={idx} value={el}>{el}</option>
		    });
		//complete STATE
		var states = this.state.options['State'].map(
		   function(el,idx){
			return <option key={idx} value={el}>{el}</option>
		    });

		//determine class of button SAVE (disabled if not all fields completed)
		var class_btn = this.is_disable()==true?'btn btn-primary disabled':'btn btn-primary';
			
			
		return (
		
		<div className="add_advert">
		 <h1 role="button" data-target="#advert" data-toggle="collapse" >Add Advertisement</h1>
		   <div id="advert" className="row collapse">
			<form className="col-sm-6">
			   <div className="form-group">
				<label>Title</label>
				<input className="form-control"
				   value={this.state.adver_obj['Title']} 
				   onChange={this.select.bind(this,'Title')}
				   />
			   </div>
			   <div className="form-group">
				<label>Price</label>
				<input className="form-control" 
				   value={this.state.adver_obj['Price']} 
				   onChange={this.select.bind(this,'Price')}
				   />
			   </div>
			   <div className="form-group">

				<label>Category</label>
				<select className="form-control" 
					onChange={this.select.bind(this,'Category')} 
					value={this.state.adver_obj["Category"]}
					>
					   <option value="">Select one category...</option>
					{categories}
				</select>
			   </div>
			   <div className="form-group">
				<label>Age</label>
				<select className="form-control" 
					onChange={this.select.bind(this,'Age')} 
					value={this.state.adver_obj["Age"]}
					>
					   <option value="">Select one age...</option>
					{ages}
				</select>
			   </div>
			   <div className="form-group">
				<label>State</label>
				<select className="form-control" 
					onChange={this.select.bind(this,'State')}
					value={this.state.adver_obj['State']}
					>
					<option value="">Select one state...</option>
					{states}
				</select>
			   </div>
			</form>
			<form className="col-sm-6">
			   <div className="form-group">
				<label>Description</label>
				<div className="textarea_container">
					<textarea 
					   className="form-control" 
					   value={this.state.adver_obj['Description']} 
					   onChange={this.select.bind(this,'Description')}
					   >
					</textarea>
					<div className="btn_container">
					  <a role="button"
					      className="btn btn-default"
					      onClick={this.cancel}
					      >
					      Cancel
  					  </a>
					  <a role="button"
					      className={class_btn}
					      onClick={this.save}
					      >
					      Save
  					  </a>
					</div>
				</div>
			   </div>
			</form>
		   </div>  
		</div>	


		)}

	})


var ListAdverts = React.createClass({
	
	render:function()
		{
		var resNodes = this.props.data.map(function(el,idx)
			{
			return (
				<Advert data={el} key={idx} methods={this.props.methods}/>	
				)
			}.bind(this));
	
		return (
			<div>
			{resNodes}
			</div>
		)}

	});

//Simple component, which is advertisement item.
//It accept METHODS (pointer to hight level parent - Container, to make possible change array of adverts)
//it is also accepting DATA - is the object for rendering one item
var Advert = React.createClass({

	//call ajax and then - call parent method to change adverts array and update state (re-render view)
	remove:function(e)
		{
		var idx = e.target.id;
		this.props.methods.remove_advert(idx);
		},

	upd_adver:function(e)
		{
		//disclose add advert window and scrol to top
		$('#advert').collapse('show');
		$('body').animate({'scrollTop':'0px'});
		var idx = e.target.id;
		this.props.methods.update_advert(idx);
		},

	render:function()
		{
		var obj = this.props.data;
	
		return (
			<div className="advert">
				<div className="btn_container">
					<span 
						id={obj['id']}
						onClick={this.upd_adver}
						className="glyphicon glyphicon-pencil"
						>
					</span>
					<span 
						id={obj['id']}
						className="glyphicon glyphicon-remove"
						onClick={this.remove}
						>
					</span>
				</div>


				<div className="bg"></div>	
				

				<div className="properties row">
				   <div className="property col-sm-4">
					<span className="name">Category</span>
					<span className="value">{obj['Category']}</span>
				   </div>
				   <div className="property col-sm-4">
					<span className="name">Age</span>
					<span className="value">{obj['Age']}</span>
				   </div>
				   <div className="property col-sm-4">
					<span className="name">State</span>
					<span className="value">{obj['State']}</span>
				   </div>
		   
				</div>


				<div className="title">
					<h2>{obj['Title']} <small> {obj['Date']}</small></h2>
					<div className="price">
					   <div>PRICE</div>
					   <div>{obj['Price']}$</div>
					</div>
				</div>

				<div className="text">
					{obj['Description']}
				</div>	
		
			</div>

		)}

	})



//Spinner - simple block with position absolute and z-index = 1000;
//It is covering all place of parent block and not allow for user press any keys etc
//!!!Parent block must have position relative
//As for reusing cross projects - Spinner requiring additional styles (from css separate with comments blocks)
//Spinner block appearance depends on param "show" which can be true or false and changing display CSS property of spinner block
//core of spinner animation - is keyframes determined in CSS 
var Spinner = React.createClass(
	{
	render:function(){
		var cls_name = this.props.show===true?'':'hidden_s';
		cls_name = 'spinner '+cls_name;
		return (
			<div className={cls_name}>
				<div className="round a"></div>
				<div className="round b"></div>	
			</div>

		)}

	}


)







ReactDOM.render(<Container />,document.getElementById('example'));

