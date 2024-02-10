const express = require("express");
const app = express();
const cors = require('cors')
const loginRoute = require('./routes/user/userLogin')
const getAllUsersRoute = require('./routes/user/userGetAllUsers')
const registerRoute = require('./routes/user/userSignUp')
const getUserByIdRoute = require('./routes/user/userGetUserById')
const dbConnection = require('./config/db.config')
const editUser = require('./routes/user/userEditUser')
const deleteUser = require('./routes/user/userDeleteAll')
const createList = require('./routes/list/listCreate')
const getListById = require('./routes/list/listGetListById')
const getRecentLists = require('./routes/list/listGetRecentLists')
const getAllListsByUser = require('./routes/list/listGetAllListsByUser')
const addAlbumToList = require('./routes/list/listAddAlbumToList')
const albumInListsCount = require('./routes/list/listAlbumInListsCount')
const saveRating = require('./routes/rating/ratingSave')
const getRatingByUserAndAlbum = require('./routes/rating/ratingGetByUserAndAlbum')
const getAvgRatingByAlbum = require('./routes/rating/ratingGetAvgByAlbum')
const getHighestRatedAlbums = require('./routes/rating/ratingGetHighestRatedAlbums')
const getAlbumDetails = require('./routes/api/apiGetAlbumDetails')
const searchArtists = require('./routes/api/apiSearchArtists')
const searchAlbums = require('./routes/api/apiSearchAlbums')
const getAlbumsByArtist = require('./routes/api/apiGetAlbumsByArtist')

require('dotenv').config();
const SERVER_PORT = 8081

dbConnection()
app.use(cors({origin: '*'}))
app.use(express.json())
app.use('/user', loginRoute)
app.use('/user', registerRoute)
app.use('/user', getAllUsersRoute)
app.use('/user', getUserByIdRoute)
app.use('/user', editUser)
app.use('/user', deleteUser)
app.use('/list', createList)
app.use('/list', getListById)
app.use('/list', getRecentLists)
app.use('/list', getAllListsByUser)
app.use('/list', addAlbumToList)
app.use('/list', albumInListsCount)
app.use('/rating', saveRating)
app.use('/rating', getRatingByUserAndAlbum)
app.use('/rating', getAvgRatingByAlbum)
app.use('/rating', getHighestRatedAlbums)
app.use('/api', getAlbumDetails)
app.use('/api', searchArtists)
app.use('/api', searchAlbums)
app.use('/api', getAlbumsByArtist)



app.listen(SERVER_PORT, (req, res) => {
    console.log(`The backend service is running on port ${SERVER_PORT} and waiting for requests.`);
})
