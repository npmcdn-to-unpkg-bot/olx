

var Container = React.createClass({
	getInitialState:function()
		{
		return {
		adverts:[
			{'id':'11','Category':'Food',"Age":"Brandnew",'State':'Perfect',"Price":'130','Description':'rferfer ref'},
			{'id':'12','Category':'Food',"Age":"Brandnew",'State':'Perfect',"Price":'130','Description':'rferfer ref'}

		]

		}

	
		},


	componentDidMount:function()
		{
		this.get_adverts();
		
		},


	//SET REQUESTS TO BACKEND
	//GET ADVERT
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
			this.forceUpdate();
			console.log(data);
			
			}.bind(this),
		   error:function(xhr,status,err)
			{
			this.state.spinner = false;
			this.forceUpdate();
			alert('Something happened wrong when obtaining adverts from database! '+err);
			}.bind(this)

		   })	

		},


	remove_advert:function(idx)
		{
		console.log('ff',idx);
		this.state.adverts = this.state.adverts.filter(function(el){return el['id']!=idx});
		this.forceUpdate();
		},

	render:function()
		{
		//create dictionary with pointers to methods. It will be declining down to every child
		//Aim - from child change adverts array (by calling particular method) and re-render view
		var methods = {};
		methods['remove_advert'] = this.remove_advert;
		return (
		<div className="main_container">
			<Spinner show={this.state.spinner}/>
			<AddAdvert methods={methods} />			
			<ListAdverts data={this.state.adverts} methods={methods}/>
		</div>
		
		)}


	})



var AddAdvert = React.createClass({
	getInitialState:function()
		{
		return {
		test:['ferfer'],
		//object which will be send to backend
		adver_obj:
		  {
		  'Category': '',
		  'Age':'',
		  'State':'',
		  'Date':'',
		  'Price':'',
		  'Description':'',
		  'Title':''
		  },
		//options
		options:
		  {
		  'Categories':['Food','Clothes','For Auto','Gadgets'],
		  'Age':['Brandnew','1 year old', '2 years old','3 years old', '3+ years old'],
		  'State':['Perfect', 'Good', 'Singificanlty used', 'Not working']
		  },
		spinner:false


		  }
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
			if (this.state.adver_obj[each]==''&&each!='Date')
				{
				return true;
				}	
			}
		return false;
		},

	save:function(e)
		{
		console.log(this.state.adver_obj);
		},

	render: function()
		{

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

		//determine class of button
		var class_btn = this.is_disable()==true?'btn btn-primary disabled':'btn btn-primary';
			
			
		return (
		
		<div className="add_advert">
		 <h1 role="button" data-target="#advert" data-toggle="collapse" >Add Advertisement</h1>
		   <div id="advert" className="row collapse">
			<Spinner show={this.state.spinner} />
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
				<select className="form-control" onChange={this.select.bind(this,'Category')}>
					<option value="1">Select one category...</option>
					{categories}
				</select>
			   </div>
			   <div className="form-group">
				<label>Age</label>
				<select className="form-control" onChange={this.select.bind(this,'Age')}>
					<option>Select one age...</option>
					{ages}
				</select>
			   </div>
			   <div className="form-group">
				<label>State</label>
				<select className="form-control" onChange={this.select.bind(this,'State')}>
					<option>Select one state...</option>
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
		var new_el = {'id':'12','Category':'Food',"Age":"Brandnew",'State':'Perfect',"Price":'130','Description':'rferfer ref'};
		this.props.methods.remove_advert(idx);
		
		},

	render:function()
		{
		var obj = this.props.data;
	
		return (
			<div className="advert">
				<div className="btn_container">
					<span 
						id={obj['id']}
						onClick={this.remove}
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
					<h2>Sell gadget <small> 2016-14-12</small></h2>
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
		var cls_name = this.props.show===true?'':'hidden';
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

