angular.module('app.services', [])
    .service('ThemeManager', function (MediaManager, PlayListManager) {
        var getThemeList = function () {
            var themeList = JSON.parse(window.localStorage.themeList || '[]');
            return _.sortBy(themeList, function (theme) { return theme.id });
        }

        var getThemeListBySearchKey = function (searchKey) {
            var themeList = this.getThemeList();

            if (searchKey == "")
                return _.sortBy(themeList, function (theme) { return theme.id });

            themeList = _.filter(themeList, function (theme) {
                return (theme.title.indexOf(searchKey) >= 0 || theme.artist.indexOf(searchKey) >= 0);
            })

            return themeList;
        }

        var getThemeListForPlayList = function (themeIds) {
            console.log(themeIds);
            var themeList = this.getThemeList();
            themeList = _.filter(themeList, function (theme) { return !_.contains(themeIds, theme.id) });        // { return theme.playlist <= 0 || theme.playlist == undefined });
            return themeList;
        }

        var getTheme = function (id) {
            var theme = _.find(this.getThemeList(), function (theme) { return theme.id == id });
            if (theme != undefined)
                return theme;
            else
                return {};
        }

        var makeNewTheme = function () {
            var themeList = this.getThemeList();

            var maxIDTheme = _.max(themeList, function (theme) { return theme.id; });
            var maxID = 0;
            if (maxIDTheme != -Infinity) {
                maxID = maxIDTheme.id + 1;
            } else {
                maxID = 1;
            }

            var theme = {};

            theme.id = maxID;
            theme.audio_name = "";
            theme.artist = "";
            theme.title = "";
            theme.tone = "DO";
            theme.speed = 10;
            theme.note = "";
            theme.fontStyle = "Georgia, serif";
            theme.mode = "line";
            theme.fontSize = 15;
            theme.audio_file = "";
            theme.justification = "left";
            theme.bold = false;
            theme.color = "#26afb2";
            theme.letter = "";
            theme.letterItemList = [];
            theme.tested = false;

            return theme;
        }

        var saveTheme = function (t, cb) {
            var themeList = this.getThemeList();

            if (t.audio_file && (typeof t.audio_file == 'object')) {
                MediaManager.saveSource(t.audio_file, function (filePath) {
                    console.log("Previous Audio File " + t.audio_file);
                    t.audio_file = filePath;
                    var index = _.findLastIndex(themeList, { id: t.id });
                    console.log("Changed Audio File" + t.audio_file);
                    if (index < 0) {
                        var maxIDTheme = _.max(themeList, function (theme) { return theme.id; });
                        if (maxIDTheme != -Infinity) {
                            t.id = maxIDTheme.id + 1;
                        } else {
                            t.id = 1;
                        }
                        themeList.push(t);
                    } else {
                        themeList.splice(index, 1, t);
                    }
                    window.localStorage.themeList = JSON.stringify(themeList);
                    cb();
                });
            } else {
                var index = _.findLastIndex(themeList, { id: t.id });
                if (index < 0) {
                    var maxIDTheme = _.max(themeList, function (theme) { return theme.id; });
                    if (maxIDTheme != -Infinity) {
                        t.id = maxIDTheme.id + 1;
                    } else {
                        t.id = 1;
                    }
                    themeList.push(t);
                } else {
                    themeList.splice(index, 1, t);
                }
                window.localStorage.themeList = JSON.stringify(themeList);
                cb();
            }
        }

        var deleteTheme = function (id) {
            var themeList = _.filter(this.getThemeList(), function (theme) { return theme.id != id });

            var playlList = PlayListManager.getPlaylList();

            for (var i in playlList) {
                var playlist = playlList[i];

                var themeIds = playlist.themeIds;

                for (var j in themeIds) {
                    if (themeIds[j] == id) {
                        PlayListManager.deleteThemeInPlayList(playlist.id, id);
                    }
                }
            }

            window.localStorage.themeList = JSON.stringify(themeList);
        }

        var updateTheme = function (theme) {
            var id = theme.id;
            var themeList = this.getThemeList();
            var index = _.findLastIndex(themeList, { id: id });
            themeList.splice(index, 1, theme);
            window.localStorage.themeList = JSON.stringify(themeList);
        }

        var updateThemePlayList = function (themeID, playlistID) {
            var themeList = this.getThemeList();

            var index = _.findLastIndex(themeList, { id: themeID });

            themeList[index].playlist = playlistID;

            window.localStorage.themeList = JSON.stringify(themeList);
        }

        var clearThemeList = function () {
            window.localStorage.themeList = '[]';
        }

        return {
            getTheme: getTheme,
            getThemeListForPlayList: getThemeListForPlayList,
            getThemeListBySearchKey: getThemeListBySearchKey,
            updateTheme: updateTheme,
            getThemeList: getThemeList,
            saveTheme: saveTheme,
            clearThemeList: clearThemeList,
            deleteTheme: deleteTheme,
            makeNewTheme: makeNewTheme,
            updateThemePlayList: updateThemePlayList
        }
    })
    .service("PlayListManager", function () {
        var getPlaylList = function () {
            var playlList = JSON.parse(window.localStorage.playlList || '[]');
            return _.sortBy(playlList, function (playlist) { return playlist.id });
        }

        var getPlayList = function (id) {
            var playlist = _.find(this.getPlaylList(), function (playlist) { return playlist.id == id });
            if (playlist != undefined)
                return playlist;
            else
                return {};
        }

        var getPlaylListBySearchKey = function (searchKey) {
            var playlList = this.getPlaylList();

            if (searchKey == "")
                return _.sortBy(playlList, function (playList) { return playList.id });

            playlList = _.filter(playlList, function (playlList) {
                return (playlList.title.indexOf(searchKey) >= 0 || playlList.note.indexOf(searchKey) >= 0);
            })

            return playlList;
        }

        var getPlaylListByTodayDate = function () {
            var playlList = this.getPlaylList();

            playlList = _.filter(playlList, function (playList) {
                var d = new Date(playList.date);
                return d.toLocaleDateString() == new Date().toLocaleDateString();
            })

            console.log(playlList)
            return playlList;
        }

        var makeNewPlayList = function () {
            var playlList = this.getPlaylList();
            var maxIDPlayList = _.max(playlList, function (playList) { return playList.id; });
            var maxID;
            if (maxIDPlayList != -Infinity) {
                maxID = maxIDPlayList.id + 1;
            } else {
                maxID = 1;
            }
            var playList = {};

            playList.id = maxID;
            playList.title = "";
            playList.note = "";
            playList.themeIds = [];
            playList.date = new Date();
            playList.image = null;

            return playList;
        }

        var savePlayList = function (t) {
            var playlList = this.getPlaylList();

            t.audio_file = "";
            var index = _.findLastIndex(playlList, { id: t.id });
            if (index < 0) {
                var maxIDPlayList = _.max(playlList, function (playList) { return playList.id; });
                if (maxIDPlayList != -Infinity) {
                    t.id = maxIDPlayList.id + 1;
                } else {
                    t.id = 1;
                }
                playlList.push(t);
            } else {
                playlList.splice(index, 1, t);
            }
            window.localStorage.playlList = JSON.stringify(playlList);
        }

        var deletePlayList = function (id) {
            var playlList = _.filter(this.getPlaylList(), function (playlist) { return playlist.id != id });

            var playlist = this.getPlayList(id);

            // _.each(playlist.themeIds, function (id) {
            //     ThemeManager.updateThemePlayList(id, -1);
            // });

            window.localStorage.playlList = JSON.stringify(playlList);
        }

        var updatePlayList = function (playlist) {
            var id = playlist.id;

            var playlList = this.getPlaylList();
            var index = _.findLastIndex(playlList, { id: id });
            //       var oldThemeIds = playlList[index].themeIds;
            playlList.splice(index, 1, playlist);
            window.localStorage.playlList = JSON.stringify(playlList);

            // _.each(oldThemeIds, function (id) {
            //     ThemeManager.updateThemePlayList(id, -1);
            // });

            // _.each(playlist.themeIds, function (id) {
            //     ThemeManager.updateThemePlayList(id, playlist.id);
            // });
        }

        var deleteThemeInPlayList = function (playListID, themeID) {
            var playlList = this.getPlaylList();
            var playlist = _.find(playlList, function (playlist) { return playlist.id == playListID });
            var themeIds = playlist.themeIds;

            console.log(themeIds);

            var newThemeIds = _.filter(themeIds, function (id) {
                return id != themeID
            })

            console.log(newThemeIds);

            playlist.themeIds = newThemeIds;
            window.localStorage.playlList = JSON.stringify(playlList);
        }

        var duplicatePlayList = function (id) {
            var playlList = this.getPlaylList();
            var index = _.findLastIndex(playlList, { id: id });
            var playlist = playlList[index];

            var newPlayList = _.clone(playlist);

            var maxIDPlayList = _.max(playlList, function (playList) { return playList.id; });
            if (maxIDPlayList != -Infinity) {
                newPlayList.id = maxIDPlayList.id + 1;
            } else {
                newPlayList.id = 1;
            }
            playlList.push(newPlayList);

            window.localStorage.playlList = JSON.stringify(playlList);

        }

        return {
            getPlaylList: getPlaylList,
            savePlayList: savePlayList,
            makeNewPlayList: makeNewPlayList,
            getPlayList: getPlayList,
            updatePlayList: updatePlayList,
            deletePlayList: deletePlayList,
            duplicatePlayList: duplicatePlayList,
            getPlaylListBySearchKey: getPlaylListBySearchKey,
            getPlaylListByTodayDate: getPlaylListByTodayDate,
            deleteThemeInPlayList: deleteThemeInPlayList
        }
    })
    .service("RootManager", function ($rootScope, ThemeManager) {
        var saveLoginState = function (state) {
            window.localStorage.isLogin = JSON.stringify(state);
        }

        var getLoginState = function () {
            var loginState = JSON.parse(window.localStorage.isLogin || false);
            return loginState;
        }

        return {
            saveLoginState: saveLoginState,
            getLoginState: getLoginState
        }
    })
    .service("ImageManager", function ($rootScope, $cordovaFile) {
        var saveSource = function (imageURI, cb) {
            if (window.cordova) {
                window.resolveLocalFileSystemURL(imageURI, success, fail);

                function fail(e) {
                    cb(null);
                }

                function success(fileEntry) {
                    var newFileName = new Date().getTime() + ".png";
                    var namePath = fileEntry.nativeURL.substr(0, fileEntry.nativeURL.lastIndexOf('/') + 1);
                    $cordovaFile.copyFile(namePath, fileEntry.name, cordova.file.dataDirectory, newFileName).then(function (success) {
                        if (cordova.file.dataDirectory.startsWith("file")) {
                            cb(cordova.file.dataDirectory.substr(7) + newFileName);
                        } else {
                            cb(cordova.file.dataDirectory + newFileName);
                        }
                    })
                }
            };

        }

        return {
            saveSource: saveSource
        }
    })
    .service("MediaManager", function ($ionicHistory, $rootScope, $cordovaFile, $ionicPlatform) {
        var saveSource = function (file, cb) {
            if (window.cordova) {
                if ($ionicPlatform.is('ios')) {
                    var newFileName = new Date().getTime() + file.filename;
                    var namePath = file.url.substr(0, file.url.lastIndexOf('/') + 1);
                    $cordovaFile.copyFile(namePath, file.filename, cordova.file.dataDirectory, newFileName).then(function (success) {
                        cb(cordova.file.dataDirectory.substr(7) + newFileName);
                    })
                } else {
                    var filename = new Date().getTime() + file.name;
                    window.resolveLocalFileSystemURL(cordova.file.applicationStorageDirectory, function (dirEntry) {
                        dirEntry.getDirectory('media', { create: true }, function (mediaDirEntry) {
                            mediaDirEntry.getFile(filename, { create: true, exclusive: false }, function (fileEntry) {
                                fileEntry.createWriter(function (fileWriter) {
                                    fileWriter.onwriteend = function () {
                                        console.log("Successful file write:" + fileEntry.fullPath);
                                        cb(fileEntry.fullPath);
                                    }
                                    fileWriter.onerror = function () { cb(null); }
                                    fileWriter.write(file);
                                });
                            }, function (err) { cb(null); });
                        }, function (err) { cb(null); });
                    });
                }
            } else {
                cb(null);
            }
        }
        var MediaPlayer = {
            media: null,
            mediaTimer: null,
            playStatus: false,
            playAudio: function (src) {
                var self = this;
                // stop playing, if playing
                self.stopAudio();
                console.log("Media Player " + src);
                self.media = new Media(src);
                self.media.play();
            },
            resumeAudio: function (src) {
                var self = this;
                if (self.media == undefined || self.media == null) {
                    self.media = new Media(src);
                    self.media.play();
                }
                else {
                    if (!self.playStatus) {
                        self.media.play();
                    }
                    else {
                        self.media.play();
                    }
                }
                self.playStatus = true;

            },
            stopAudio: function () {
                var self = this;
                if (self.media) {
                    self.media.stop();
                    self.playStatus = false;
                }
            },
            pauseAudio: function () {
                var self = this;
                if (self.media) {
                    self.media.pause();
                }
            },
            doMute: function () {
                var self = this;
                if (self.media) {
                    self.media.setVolume('0.0');
                }
            },
            undoMute: function () {
                var self = this;
                if (self.media) {
                    self.media.setVolume('1.0');
                }
            }
        }

        return {
            saveSource: saveSource,
            MediaPlayer: MediaPlayer
        }
    })
    .service('UserManager', function () {
        var makeNewUser = function () {
            var user = {};

            user.id = 1;
            user.user_email = '';
            user.user_name = '';
            user.user_music_group = '';
            user.user_surname = '';
            user.user_direction = '';
            user.user_city = '';
            user.user_cp = '';
            user.user_province = '';
            user.user_telephone = '';
            user.user_license = '';
            user.user_artist_name = '';
            user.user_pt_purpose = '';

            return user;
        }

        var saveUser = function (user) {
            window.localStorage.user = JSON.stringify(user);
        }

        var getUser = function () {
            var user = JSON.parse(window.localStorage.user || '{}');
            return user;
        }

        return {
            makeNewUser: makeNewUser,
            saveUser: saveUser,
            getUser: getUser
        }
    })