import React, {useEffect} from 'react';
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
  const {classes, url, setUrl, error, submit} = props;
  const handleChange = (event) => {
    setUrl(event.target.value);
  }
  return (
    <div className={classes.root}>
      <TextField error={error} className={classes.field} value={url} id="urlInput" label="Url Input" onChange={handleChange}/>
      <Button variant="contained" color="primary" onClick={submit}>Create Url</Button>
    </div>
  );
}

function EasierViewer() {
  const classes = useStyles();
  const [url, setUrl] = React.useState("");
  const [links, setLinks] = React.useState([]);
  const [error, setError] = React.useState(false);

  const loadLinks = () => {
    fetch(rootUrl).then((response) => response.json().then((jsonData) => {
      const smallUrlList = jsonData.smallUrlList;
      const newLinks = [];
      smallUrlList.map((urlData) => {
        newLinks.push([rootUrl + urlData.urlPath, urlData.data.target]);
      });
      setLinks(newLinks);
    }).catch(() => {
      setLinks([]);
      setError(true);
    }));
  }

  useEffect(() => {
    loadLinks();
  }, [links]);

    const submit = () => {
      const init = {
        method: 'PUT',
        body: url,
        headers: {
          'Access-Control-Allow-Origin': '*',
        }
      };
      fetch(rootUrl, init)
        .then((response) => {
          if(response.ok) {
            loadLinks();
            setError(false);
            setUrl("");
          } else {
            setError(true);
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
          error={error}
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
