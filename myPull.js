/*
 * This code is developed by Hakeem Abdulmalik.
 * It is created to connect to the Theatre management system's REST API.
 * The program pulls the names of the database and reads out the ones with data.
 * From there the user can filter data, read reports, and download data.
 * The program requires that the user has a user name and password created
 * by The Theatre management system and user has to have logined in at least one
 * to the online ticket selling site.
 * The credintals created from that site will enable them to login to this web app.
 *
 */
var username = ""; // The username that is kept in the cookie to allow easy access.
var password = ""; // The password that is kept in the cookie to allow easy access.
var mySchemas; // The name of the schemas that are pulled.
var myURL; // The url of the schema
var myUP; // The username and password put together for the HTTP request
var testText = []; // Used to hold data from the JSON file.
var objName; // The name of the object in the parsed JSON object
var tempTest; // A temporary varible used for testing.
var currentUser; // The name of the current user, pulled from the "me" schema.
var showEndpoint = []; // Holds the names of tables that have data.
var getObjs = []; // Holds the tables that are returned.
var myObj;
var eventObj;
var performanceObj;
var firstTable = new buildTables();
// Runs the login service
function login()
{
      username = document.getElementById('user').value;
      password = document.getElementById('password').value;
      setCookie('username',username); // Sets the username as cookie for easy access.
      setCookie('password',password); // Sets the password as cookie for easy access.
      checkPassword();
}

function btnUpload() {
    upLoad();
}

function upLoad()
{
    var wb = XLSX.utils.table_to_book(document.getElementById('finalBody'), ("Sheet, JS"));
    var wbout = XLSX.write(wb, {booktype:'xlsx', bookSST:true, type: 'binary'})

    saveAs(new Blob([s2ab(wbout)], {type:"application/octet-stream"}), 'myTests.xlsx');

}

function s2ab(s)
{
    var buf = new ArrayBuffer(s.length);
    var view = new Uint8Array(buf);
    for (var i = 0; i < s.length; i++) view[i] = s.charCodeAt(i) & 0xFF;
    return buf;
}

// Checks if the password is correct
// If password is correct send the user to theHippTools.html and writes their name.
function checkPassword()
{

      const xhr = new XMLHttpRequest();

      xhr.onreadystatechange = function ()
      {
            if (xhr.readyState == 4) {
                  if (xhr.status == 200)
                  {
                        window.location.href = "theHippTools.html"; // Send the user to the web app.
                        myObj = JSON.parse(xhr.responseText);

                        var i = 0;
                        for (x in myObj) // Pull the data from "me" table.
                        {
                              testText[i] = x;
                              i++;
                        }

                  }

                  if (xhr.status > 300)
                  {
                        window.location.href = "login.html";
                  }
            }
      }

      checkCookie();
      username = getCookie("username");
      password = getCookie("password");

      myURL = "https://tickets.thehipp.org/api/v1/me.json";
      myUP = username + ":" + password;

      xhr.open("get", myURL, true);
      xhr.setRequestHeader("Authorization", "Basic " + btoa(myUP));
      xhr.send();

}

// Checks if cookies are still active when theHippTools loads.
function checkMyCookies()
{
      const xhr = new XMLHttpRequest();

      xhr.onreadystatechange = function ()
      {
            if (xhr.readyState == 4)
            {
                  if (xhr.status == 200)
                  {

                        myObj = JSON.parse(xhr.responseText);
                        currentUser = myObj.patron_name;
                        document.getElementById('instructions').innerHTML =  currentUser;
                  }

                  if (xhr.status > 300)
                  {
                        window.location.href = "login.html";
                  }
            }
      }

      checkCookie();
      username = getCookie("username");
      password = getCookie("password");

      myURL = "https://tickets.thehipp.org/api/v1/me.json";
      myUP = username + ":" + password;


      xhr.open("get", myURL, true);
      xhr.setRequestHeader("Authorization", "Basic " + btoa(myUP));
      xhr.send();
}

//************************************************************************
//************************************************************************
// Create a diagram showing how the json files are pulled and parsed.
// Then show how to read different infomation from those files.
// and show how to pull data from different sources and create files
// as well as create new kinds of searches, and excel sheets.
// Incorperate Git, AJAX, Bootstrap, and JQUERY into the code.
//************************************************************************
//************************************************************************

//************************************************************************
//************************************************************************
//************************************************************************
// How the data is pulled. object = JSON.parse(xhrRunMe.responseText)
// To call when the object uses data as the first json name:
// object.data[0] from here the item can be accessed.
// e.g. object.data[0].endpoints This will print the endpoint for the
// object data at index 0.


function runMe(myCol)
{

      const xhrRunMe = new XMLHttpRequest();

      xhrRunMe.onreadystatechange = function ()
      {
            if (xhrRunMe.readyState == 4) {
                  if (xhrRunMe.status == 200) {

                        myObj = JSON.parse(xhrRunMe.responseText);
                        var i = 0;
                        for (x in myObj)
                        {
                              // create options
                              if (x == "data")
                              {
                                    tempTest = myObj[x];
                              }
                              else
                              {
                                    testText[i] = x;
                                    i++;
                              }
                        }
                    }

                  else
                    {
                        console.log("Hello");
                    }
            }
      }

      checkCookie();
      username = getCookie("username");
      password = getCookie("password");

      myURL = "https://tickets.thehipp.org/api/v1/" + myCol + "/schema.json";
      myUP = username + ":" + password;


      xhrRunMe.open("get", myURL, true);
      xhrRunMe.setRequestHeader("Authorization", "Basic " + btoa(myUP));
      xhrRunMe.send();

}

// Gets each table but only with one item in the table.
// This is to test if the table has any data.
// Start here.
function getTableEndpoint(getEndpoint, j)
{

      const getXhr = new XMLHttpRequest();

      getXhr.onreadystatechange = function ()
      {
            if (getXhr.readyState == 4)
            {
                  if (getXhr.status == 200)
                  {


                        getObjs[j] = JSON.parse(getXhr.responseText);
                        var i = 0;

                        for (x in getObjs)
                        {
                              if (x == "data")
                              {

                                    // Start working here
                                    // It needs to check the size of the object
                                    // if it is less than 0 get rid of it.

                                    for (var i = 0; i < getObjs.data.length; i++)
                                    {
                                          tempTest = getObjs.data[i];
                                    }

                              }
                              else
                              {
                                    testText[i] = x;
                                    i++;
                              }
                        }

                  }

                  else if (getXhr.status > 200)
                  {
                        j--;
                  }
            }
      }

      checkCookie();
      username = getCookie("username");
      password = getCookie("password");

      myURL = "https://tickets.thehipp.org/api/v1/" + getEndpoint + ".json?page_size=25";
      // myURL = "https://tickets.thehipp.org/api/v1/" + getEndpoint + ".json?page_size=1"; ORIGINAL *******************************
      myUP = username + ":" + password;

      getXhr.open("get", myURL, true);
      getXhr.setRequestHeader("Authorization", "Basic " + btoa(myUP));
      getXhr.send();

      return j;

}

// Get all the tables then check them for any
function runTables()
{

      const xhr = new XMLHttpRequest();

      xhr.onreadystatechange = function ()
      {
            if (xhr.readyState == 4)
            {
                  if (xhr.status == 200)
                  {


                        myObj = JSON.parse(xhr.responseText);
                        var i = 0;
                        for (x in myObj)
                        {
                              // create options
                              if (x == "data")
                              {
                                    for (var i = 0; i < myObj.data.length; i++)
                                    {
                                          showEndpoint[i] = -1;
                                          getObjs[i] = -1;
                                    }

                                    for (var i = 0; i < myObj.data.length; i++)
                                    {
                                          showEndpoint[i] = myObj.data[i].endpoint; // Get the name of a table.
                                          i = getTableEndpoint(showEndpoint[i], i); // Get the table and check if it has any data.
                                    }
                              }
                              else
                              {
                                    testText[i] = x;
                                    i++;
                              }
                        }

                  }
            }
      }

      checkCookie();
      username = getCookie("username");
      password = getCookie("password");

      myURL = "https://tickets.thehipp.org/api/v1.json";
      myUP = username + ":" + password;

      xhr.open("get", myURL, true);
      xhr.setRequestHeader("Authorization", "Basic " + btoa(myUP));
      xhr.send();

}

function get_Event_Info()
{
    var get_Show_Code = " ";
    get_Show_Code = document.getElementById('showCode').value;
    runEvent(get_Show_Code);
    runPerformances(get_Show_Code);

    // Pull from the event table for totals

    // Pull from the performances for indivisual show times.
}

function get_Event_Tables()
{
      var j = 0;

      for (var i = 0; i < getObjs.length; i++)
      {
            tempTest = getObjs[i];

            // This checks if the data has at least 25 entries of data.

            if (getObjs[i].data && !(tempTest == -1))
            {
                  if(getObjs[i].data.length == 25)
                  {
                        // Show the tables with data in them.
                        var para = document.createElement("li");
                        var node = document.createTextNode(showEndpoint[i] + " " + j);
                        para.appendChild(node);
                        para.setAttribute("id", showEndpoint[i]);
                        para.setAttribute("onclick", "chooseCol(this.id)")

                        var element = document.getElementById("databaseList");
                        element.appendChild(para);
                        j++;
                  }
            }

            else
            {

            }

      }
}

function runPerformances(showCode)
{

      const xhrPerformance = new XMLHttpRequest();
      var eventResponse;

      xhrPerformance.onreadystatechange = function ()
      {
            if (xhrPerformance.readyState == 4)
            {
                  if (xhrPerformance.status == 200)
                  {
                    performanceObj = JSON.parse(xhrPerformance.responseText);
                    document.getElementById('instructions').innerHTML = performanceObj.data[0].series_code + " " + performanceObj.data[0].discount + " " + performanceObj.data[0].price_paid;
                    firstTable.bodyOfTable(performanceObj);
                  }
            }
      }

      // After the query is made get the

      checkCookie();
      username = getCookie("username");
      password = getCookie("password");

      myURL = "https://tickets.thehipp.org/api/v1/performances/?q=show_code:%27" + showCode + "%27";
      myUP = username + ":" + password;

      xhrPerformance.open("get", myURL, true);
      xhrPerformance.setRequestHeader("Authorization", "Basic " + btoa(myUP));
      xhrPerformance.send();

}

function runEvent(showCode)
{

      const xhrEvent = new XMLHttpRequest();
      var eventResponse;

      xhrEvent.onreadystatechange = function ()
      {
            if (xhrEvent.readyState == 4)
            {
                  if (xhrEvent.status == 200)
                  {
                    eventObj = JSON.parse(xhrEvent.responseText);
                    document.getElementById('instructions').innerHTML = eventObj.data[0].title + " " + eventObj.data[0].discount + " " + eventObj.data[0].price_paid;

                    firstTable.footOfTable(eventObj);
                  }
            }
      }

      // After the query is made get the

      checkCookie();
      username = getCookie("username");
      password = getCookie("password");

      myURL = "https://tickets.thehipp.org/api/v1/events/?q=show_code:%27" + showCode + "%27";
      myUP = username + ":" + password;

      xhrEvent.open("get", myURL, true);
      xhrEvent.setRequestHeader("Authorization", "Basic " + btoa(myUP));
      xhrEvent.send();

}

function buildTables() {

    // Show the tables with data in them.
    // function for creating nodes
    this.bodyOfTable = function(performanceObj)
    {
        for (var i = 0; i < performanceObj.data.length; i++)
        {

            var element = document.getElementById("finalBody");

            var top = document.createElement("tr");

            var para = document.createElement("th");
            node = document.createTextNode(performanceObj.data[i].series_code);
            para.setAttribute("scope", "row");
            para.appendChild(node);
            top.appendChild(para);

            var para1 = document.createElement("td");
            var node1 = document.createTextNode(performanceObj.data[i].perform_date)
            para1.appendChild(node1);
            top.appendChild(para1);

            var para2 = document.createElement("td");
            var node2 = document.createTextNode(performanceObj.data[i].perform_time)
            para2.appendChild(node2);
            top.appendChild(para2);

            var para3 = document.createElement("td");
            var node3 = document.createTextNode(performanceObj.data[i].perform_year)
            para3.appendChild(node3);
            top.appendChild(para3);

            var para4 = document.createElement("td");
            var node4 = document.createTextNode(performanceObj.data[i].total_sold)
            para4.appendChild(node4);
            top.appendChild(para4);

            var para5 = document.createElement("td");
            var node5;
            var x = performanceObj.data[i].price_paid;
            var y = performanceObj.data[i].discount;
            var z = performanceObj.data[i].ticket_fee_one;
            var eventTotal = x - y + z;
            node5 = document.createTextNode("$" + eventTotal);
            para5.appendChild(node5);
            top.appendChild(para5);

            element.appendChild(top);
        }
    }


    this.footOfTable = function(eventObj)
    {
        var element = document.getElementById("finalFoot");

        para = document.createElement("th");
        node = document.createTextNode("Event title: " + eventObj.data[0].title);
        para.setAttribute("scope", "col")
        para.appendChild(node);
        element.appendChild(para);

        para3 = document.createElement("th");
        node3 = document.createTextNode(" ");
        para3.appendChild(node3);
        element.appendChild(para3);

        para4 = document.createElement("th");
        node4 = document.createTextNode(" ");
        para4.appendChild(node4);
        element.appendChild(para4);

        para5 = document.createElement("th");
        node5 = document.createTextNode(" ");
        para5.appendChild(node5);
        element.appendChild(para5);

        var para1 = document.createElement("th");
        node = document.createTextNode("Total " + eventObj.data[0].total_sold);
        para1.setAttribute("scope", "col")
        para1.appendChild(node);
        element.appendChild(para1);

        var para2 = document.createElement("th");
        var x = eventObj.data[0].price_paid;
        var y = eventObj.data[0].discount;
        var z = eventObj.data[0].ticket_fee1;
        var eventTotal = x - y + z;
        node = document.createTextNode("$" + eventTotal);
        para2.setAttribute("scope", "col")
        para2.appendChild(node);
        element.appendChild(para2);



    }

}

function setCookie(cname,cuser)
{
  var d = new Date();
  d.setTime(d.getTime() + (.01 * 24 * 60 * 60 * 1000));
  var expires = "expires="+d.toUTCString();
  document.cookie = cname + "=" + cuser +  ";" + expires + ";path=/";
}

function getCookie(cname)
{
  var name = cname + "=";
  var ca = document.cookie.split(';');
  for(var i = 0; i < ca.length; i++)
  {
    var c = ca[i];
    while (c.charAt(0) == ' ')
    {
      c = c.substring(1);
    }
    if (c.indexOf(name) == 0)
    {
      return c.substring(name.length, c.length);
    }
  }
  return "";
}

function checkCookie()
{
  var user = getCookie("username");
  var pass = getCookie("password");

  if (user != "" && pass != "")
  {
      document.getElementById('instructions').innerHTML = "Thank you!";
  }
  else
  {
      document.getElementById('instructions').innerHTML = "Please enter your username and password";
  }
}

// This gets the data endpoints that have at least 25 entries and creates a table from them.
// The user can then choose what information the get from the database.
// TODO: Work on one table and creat something that reads the information that is desired for that table.
function getTables()
{
      var j = 0;

      for (var i = 0; i < getObjs.length; i++)
      {
            if (getObjs[i] == -1)
            {
                  // var para = document.createElement("li");
                  // var node = document.createTextNode("**************");
                  // para.appendChild(node);
                  //
                  // var element = document.getElementById("databaseList");
                  // element.appendChild(para);
            }

            tempTest = getObjs[i];

            // This checks if the data has at least 25 entries of data.

            if (getObjs[i].data && !(tempTest == -1))
            {
                  if(getObjs[i].data.length == 25)
                  {
                        // Show the tables with data in them.
                        var para = document.createElement("li");
                        var node = document.createTextNode(showEndpoint[i] + " " + j);
                        para.appendChild(node);
                        para.setAttribute("id", showEndpoint[i]);
                        para.setAttribute("onclick", "chooseCol(this.id)")

                        var element = document.getElementById("databaseList");
                        element.appendChild(para);
                        j++;
                  }
            }

            else
            {

            }

      }
}

// Choose the columns that are returned.
function chooseCol(tempID)
{
      // Take the id name and use it to show the column names
      runMe(tempID);


}
