import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import Link from '@material-ui/core/Link';
import Paper from '@material-ui/core/Paper';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import TableCell from '@material-ui/core/TableCell';
import { TableContainer } from '@material-ui/core';
import TextField from '@material-ui/core/TextField';

const rootUrl = 'http://127.0.0.1:8080/easier/';
const useStyles = makeStyles(theme => ({
  root: {
    '& > *': {
      margin: theme.spacing(1),
    },
  },
  field: {
    margin: theme.spacing(1),
    width: 200,
  },
  paper: {
    width: '100%',
    marginBottom: theme.spacing(2),
  },
}));

function UrlInput(props) {
  const {classes, url, setUrl, submit} = props;
  const handleChange = (event) => {
    setUrl(event.target.value);
  }
  return (
    <div className={classes.root}>
      <TextField className={classes.field} value={url} id="urlInput" label="Url Input" onChange={handleChange}/>
      <Button variant="contained" color="primary" onClick={submit}>Create Url</Button>
    </div>
  );
}

function EasierViewer() {
  const classes = useStyles();
  const [url, setUrl] = React.useState("");
  const [links, setLinks] = React.useState([]);

    const submit = () => {
      const init = {
        method: 'PUT',
        body: url,
        headers: {
          'Access-Control-Allow-Origin': '*',
        }
      };
      console.log(url);
      fetch(rootUrl, init)
        .then((response) => {
          if(response.ok) {
            response.text().then((text) => {
              const path = text;
              const newLinks = Object.assign([], links);
              newLinks.push([
                rootUrl + path,
                url,
              ]);
              setLinks(newLinks);
              setUrl("");
            });
          }
        })
    }    

  return (
    <div className={classes.root}>
      <Paper className={classes.paper}>
        <UrlInput 
          classes={classes}
          url={url}
          setUrl={setUrl}
          submit={submit}
        />  
        <TableContainer>
          <Table className={classes.table}>
            <TableHead>
              <TableRow>
                <TableCell>Easier Url Link</TableCell>
                <TableCell>Destination</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {links.map((link) => {
                return(
                  <TableRow>
                    <TableCell>
                      <Link href={link[1]}>{link[0]}</Link>
                    </TableCell>
                    <TableCell>{link[1]}</TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>  
        </TableContainer>
      </Paper>
    </div>
  );
}

export default EasierViewer;
