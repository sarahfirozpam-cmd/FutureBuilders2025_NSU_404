import React from 'react';
import { IconButton, Menu, MenuItem, ListItemText, ListItemIcon } from '@mui/material';
import { Language as LanguageIcon, Check as CheckIcon } from '@mui/icons-material';
import { useTranslation } from 'react-i18next';
import { useAppStore } from '../../store/useAppStore';

const LanguageSwitcher = () => {
  const { i18n } = useTranslation();
  const { setLanguage, language } = useAppStore();
  const [anchorEl, setAnchorEl] = React.useState(null);

  const languages = [
    { code: 'en', name: 'English', nativeName: 'English' },
    { code: 'bn', name: 'Bengali', nativeName: 'বাংলা' }
  ];

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleLanguageChange = (langCode) => {
    i18n.changeLanguage(langCode);
    setLanguage(langCode);
    handleClose();
  };

  return (
    <>
      <IconButton 
        color="inherit" 
        onClick={handleClick}
        aria-label="Change language"
      >
        <LanguageIcon />
      </IconButton>
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleClose}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'right',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'right',
        }}
      >
        {languages.map((lang) => (
          <MenuItem
            key={lang.code}
            onClick={() => handleLanguageChange(lang.code)}
            selected={i18n.language === lang.code || language === lang.code}
          >
            {(i18n.language === lang.code || language === lang.code) && (
              <ListItemIcon>
                <CheckIcon fontSize="small" />
              </ListItemIcon>
            )}
            <ListItemText 
              primary={lang.nativeName}
              secondary={lang.name}
              sx={{ 
                ml: (i18n.language === lang.code || language === lang.code) ? 0 : 4 
              }}
            />
          </MenuItem>
        ))}
      </Menu>
    </>
  );
};

export default LanguageSwitcher;
