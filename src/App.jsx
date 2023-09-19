import { useState } from 'react';
import './App.css';
import axios from 'axios';
import SearchIcon from '@mui/icons-material/Search';
import PeopleIcon from '@mui/icons-material/People';
import CollectionsBookmarkIcon from '@mui/icons-material/CollectionsBookmark';
import WarningIcon from '@mui/icons-material/Warning';
import { MagnifyingGlass } from 'react-loader-spinner';

function App() {
  const [search, setSearch] = useState('');
  const [result, setResult] = useState(null);
  const [repos, setRepos] = useState([]);
  const [isFound, setIsFound] = useState(false);
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const getUser = () => {
    setIsLoading(true); 

    axios
      .get(`${import.meta.env.VITE_GITHUB_API_URL}${search}`, {
        headers: {
          Authorization: `${import.meta.env.VITE_GITHUB_TOKEN}`,
        },
      })
      .then((response) => {
        setError(null);
        setResult(response.data);
        setIsFound(true);

        axios
          .get(`https://api.github.com/users/${search}/repos`)
          .then((reposResponse) => {
            setRepos(reposResponse.data);
            setIsLoading(false); 
          })
          .catch((reposError) => {
            console.error(reposError);
            setIsLoading(false);
          });
      })
      .catch((error) => {
        setError(error);
        setIsFound(false);
        setIsLoading(false);
      });
  };

  return (
    <div className='app'>
      <h2>
        Github Profile Tracker by{' '}
        <a target='_blank' rel='noreferrer' href='https://github.com/yassiralamidev'>
          Yassir
        </a>
      </h2>
      <p>You are looking for a user profile ? This app is for you !</p>
      <div className='searchInput'>
        <input
          onChange={(e) => setSearch(e.target.value)}
          value={search}
          type='text'
          placeholder='Enter a username ...'
        />
        <button onClick={getUser}>
          <SearchIcon />
        </button>
      </div>
      {isLoading ? ( 
        <div className='loading'>
          <MagnifyingGlass 
            visible={true}
            height="80"
            width="80"
            ariaLabel="MagnifyingGlass-loading"
            wrapperStyle={{}}
            wrapperClass="MagnifyingGlass-wrapper"
            glassColor = '#E6EDF3'
            color = '#2EA043'
          />
        </div>
      ) : !isFound && error ? (
        <div className='notFound'>
          <WarningIcon sx={{ fontSize: 40 }} />
          <h3>User Not Found</h3>
          <p>Try another username</p>
        </div>
      ) : (
        result && (
          <div className='result'>
            <img src={result.avatar_url} alt='' />
            <p>{result.name}</p>
            <span>@{result.login}</span>
            {result.bio && <p>{result.bio}</p>}
            {result.location && <p>📍&nbsp;{result.location}</p>}
            <div className='result__follow'>
              <p>
                <PeopleIcon />&nbsp;{result.followers}&nbsp;Followers
              </p>
              <p>
                <PeopleIcon />&nbsp;{result.following}&nbsp;Following
              </p>
            </div>
            <p className='result__repo'>
              <CollectionsBookmarkIcon />&nbsp;Public Repositories&nbsp;({result.public_repos})
            </p>
            <div className='result__reposList'>
              {repos &&
                repos.map((repo, key) => {
                  return (
                    <a target='_blank' rel='noreferrer' key={key} href={repo.html_url}>
                      {repo.name}
                    </a>
                  );
                })}
            </div>
          </div>
        )
      )}
    </div>
  );
}

export default App;
