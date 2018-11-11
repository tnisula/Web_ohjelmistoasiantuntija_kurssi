/*
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */
package com.opiframe.beans;

import java.io.Serializable;
import java.text.MessageFormat;
import java.util.Locale;
import java.util.Random;
import java.util.ResourceBundle;
import javax.faces.bean.ManagedBean;
import javax.faces.bean.SessionScoped;
import javax.faces.context.FacesContext;
import javax.servlet.http.HttpServletRequest;

/**
 *
 * @author opiframe
 */
@ManagedBean(name="guessBean", eager=true)
@SessionScoped
public class GuessBean implements Serializable {

    private Random rand = new Random();
    int randomNumber = 0;
    int userNumber = 1;
    String message = "";

    public String getMessage() {
        return message;
    }

    public void setMessage(String message) {
        this.message = message;
    }
    int guessTimes = 0;
    public int getRandomNumber() {
        return randomNumber;
    }

    public int getUserNumber() {
        return userNumber;
    }

    public void setUserNumber(int userNumber) {
        this.userNumber = userNumber;
    }
    
    public GuessBean() {
        randomNumber = rand.nextInt(100) + 1;
        System.out.println("The number is " + randomNumber);
    }
    
    public void checkNumber()
    {
        FacesContext context = FacesContext.getCurrentInstance();
        ResourceBundle bundle = context.getApplication().getResourceBundle(context, "msg");
        guessTimes++;
        if(userNumber == randomNumber)
        {
            String pattern = bundle.getString("correct");
            message = MessageFormat.format(pattern, guessTimes, randomNumber);
            // message = "You nailed it with " + guessTimes + " guess times";
            System.out.println("Same numbers.....");
        }
        else if(userNumber > randomNumber)
        {
            // message = "Your guess is too big!";
            message = bundle.getString("too_big");
            System.out.println("too big.....");
        }
        else
        {
            // message = "Your guess is too low!";
            message = bundle.getString("too_small");
            System.out.println("too small.....");
        }
    }
    
    public void restartGame()
    {
        FacesContext session = FacesContext.getCurrentInstance();
        session.getExternalContext().invalidateSession();
    }
    
    public void initializeLocale()
    {
        // FacesContext.getCurrentInstance().getViewRoot().setLocale(new Locale("fi","FI"));
        // FacesContext.getCurrentInstance().getViewRoot().setLocale(new Locale("sv","SV"));
        // FacesContext.getCurrentInstance().getViewRoot().setLocale(new Locale("en","EN"));
        
        HttpServletRequest req = 
                (HttpServletRequest) FacesContext.getCurrentInstance().getExternalContext().getRequest();
        
        String locale = req.getHeader("accept-language").split(",")[0];
        System.out.println("Locale: " + locale);
        FacesContext.getCurrentInstance().getViewRoot().setLocale(new Locale(locale));
    }
}
