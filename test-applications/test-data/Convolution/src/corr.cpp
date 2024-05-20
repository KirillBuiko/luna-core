//g++ corr.cpp -o corr.exe
//./corr.exe corr.txt opora.dat 300

#pragma warning(disable : 4996) //for Visual Studio

#include <stdlib.h>
#include <stdio.h>
#include <fcntl.h>
#include <math.h>
#include <time.h>
#include <string.h> 
#include <sys/stat.h>

#ifdef _WIN32
#include <direct.h>
#define mkdir(path, mode) _mkdir(path)
#endif

int main(int argc, char** argv)
{
    if (argc != 4) {
#ifdef _WIN32
        //printf for Visual Studio on Windows
        printf("\
ЙНННННННННННННННННННННННННННННННННННННННННННННННННННННН»\n\
є CORR - Є®ааҐ«пжЁ®­­ п бўҐавЄ  бҐ©б¬®ва бб    2010Ј.  є\n\
є                                                      є\n\
є ‚л§®ў: corr.exe filename1 filename2 T                є\n\
є ‚л§®ў зҐаҐ§ ¬Ґ­о Far: path\\corr.exe !@! filename2 T  є\n\
є                                                      є\n\
є  filename1 - вҐЄбв®ўл© д ©« б® бЇЁбЄ®¬ бҐ©б¬®ва бб   є\n\
є              ў д®а¬ вҐ ђ‘-A                          є\n\
є  filename2 - д ©« ®Ї®а­®Ј® бЁЈ­ «  ў д®а¬ вҐ ђ‘-A    є\n\
є          T - Ё­вҐаў « Є®ааҐ«пжЁЁ ў бҐЄг­¤ е          є\n\
є                                                      є\n\
є ” ©«л аҐ§г«мв в  § ЇЁблў овбп ў Ї®¤¤ЁаҐЄв®аЁо _corr  є\n\
є ЋвзҐв ® а Ў®вҐ ўлў®¤Ёвбп ­  нЄа ­ Ё ў д ©« corr.log  є\n\
є ‚ ®взҐвҐ ¤«п Ї®«гзҐ­­ле Є®ааҐ«®ва бб ЇаЁў®¤Ёвбп      є\n\
є ®в­®иҐ­ЁҐ бЁЈ­ «/иг¬ (SNR) Ё нЄўЁў «Ґ­в­ п           є\n\
є  ¬Ї«Ёвг¤  бЁЈ­ «  (A) ў ¤ЁбЄаҐв е Ђ–Џ.               є\n\
ИННННННННННННННННННННННННННННННННННННННННННННННННННННННј\n\
...press any key...");
#else
        //printf for WSL and Linux
        printf("\
╔══════════════════════════════════════════════════════╗\n\
║ CORR - корреляционная свертка сейсмотрасс 2010г.     ║\n\
║                                                      ║\n\
║ Вызов : corr.exe filename1 filename2 T               ║\n\
║ Вызов через меню Far : path\\corr.exe !@!filename2 T  ║\n\
║                                                      ║\n\
║ filename1 - текстовый файл со списком сейсмотрасс    ║\n\
║ в формате РС - A                                     ║\n\
║ filename2 - файл опорного сигнала в формате РС - A   ║\n\
║ T - интервал корреляции в секундах                   ║\n\
║                                                      ║\n\
║ Файлы результата записываются в поддиректорию _corr  ║\n\
║ Отчет о работе выводится на экран и в файл corr.log  ║\n\
║ В отчете для полученных коррелотрасс приводится      ║\n\
║ отношение сигнал / шум(SNR) и эквивалентная          ║\n\
║ амплитуда сигнала(A) в дискретах АЦП.                ║\n\
╚══════════════════════════════════════════════════════╝\n\
...press any key...");
#endif
        getchar(); 
        exit(1);
    }

    double  A = 0, B = 0, C = 0;
    int p, N;
    FILE* h;
    int i, j;
    short Fs, st;
    char c;
    double sum = 0, sums = 0;
    clock_t t_start = clock();

    h = fopen(argv[2], "rb");
    if (h == NULL) {
        perror("\tCan't open opora");
        exit(1);
    }
    fread(&Fs, sizeof(short), 1, h);
    if (Fs != 0x4350) { 
        printf("\tInvalid format of %s", argv[2]); 
        exit(1); 
    }
    fseek(h, 32u, SEEK_SET);
    fread(&Fs, sizeof(short), 1, h);  // read sampling frequency
    fread(&N, sizeof(int), 1, h);     // read sampl.num
    fread(&st, sizeof(short), 1, h);   // read sampl.type
    //printf("type %d\n",st);
    int L = atoi(argv[3]) * Fs;
    //p=Lg2(N + L);
    //int M=1u<<p;
    int M = N + L;
    //if(M<L)L=M;
    //close(h);
    //printf("File '%s': Fs=%dHz p=%d\n", argv[2],Fs,p);
    
    const char* dir_name = "_corr";
#ifdef _WIN32
    struct _stat info;
    if (_stat(dir_name, &info) != 0) {
#else
    struct stat info;
    if (stat(dir_name, &info) != 0) {
#endif
        // Если не существует, создаем
        if (mkdir(dir_name, 0777) == -1) {
            perror("\nCan't create directory.");
            exit(1);
        }
    }

    //else printf("Directory '.\\_corr' finded");

    float* X = (float*)calloc(M, sizeof(float)),
        * S = (float*)calloc(M, sizeof(float)),
        * W = (float*)calloc(M, sizeof(float));
    int* D = (int*)calloc(M, 4);
    short* D16 = (short*)calloc(M, 2),
        * d = (short*)calloc(21u, 2);

    fseek(h, 42u, SEEK_SET);

    int a = 0, b = 0;
    if (st == 2) {
        fread(D16, sizeof(short), N, h);
        for (i = 0;i < N;i++) { 
            *(S + i) = *(D16 + i); 
            if ((b = abs(*(D16 + i))) > a)a = b; 
            A += *(D16 + i) * *(D16 + i);
            *(D16 + i) = 0; 
        }
    }
    else {
        fread(D, sizeof(int), N, h);
        for (i = 0;i < N;i++) { 
            *(S + i) = *(D + i); 
            if ((b = abs(*(D + i))) > a)a = b; 
            A += *(D + i) * *(D + i);
            *(D + i) = 0; 
        }
    }

    fclose(h);

    //A=autocorrelation 
    //CalcExps(W,p);
    // //FFT_I(S,W,p);

    b = (int)(0.5 * L);

    char trace[40], str[80];
    FILE* f, * ff;
    if ((f = fopen(argv[1], "r")) == NULL) { 
        printf("\nCan't open filelist"); 
        exit(1); 
    }
    if ((ff = fopen("corr.log", "a")) == NULL) { 
        printf("\nCan't open log file"); 
        exit(1); 
    }

    printf("\nProcessing: "); 
    fprintf(ff, "\nProcessing: ");

    while (fscanf(f, "%s", trace) != EOF)
    {
        printf("\n%s - ", trace); 
        fprintf(ff, "\n%s - ", trace);
        if ((h = fopen(trace, "rb")) == NULL) {
            perror("Can't open trace");
            continue;
        }
        fread(d, sizeof(short), 21u, h);
        fseek(h, 41u, SEEK_SET);
        fread(&c, sizeof(char), 1, h);
        if (*d != 0x4350) { 
            printf("error: invalid format"); 
            fprintf(ff, "error: invalid format"); 
            continue; 
        }
        if (*(d + 16) != Fs) { 
            printf("error: sampling frequency mismatch"); 
            fprintf(ff, "error: sampling frequency mismatch"); 
            continue; 
        }
        st = *(d + 19);
        //printf("type %d\n",st);
        for (i = 0;i < M;i++) {
            *(W + i) = *(X + i) = *(D + i) = *(D16 + i) = 0;
        }
        if (st == 2) {
            fread(D16, sizeof(short), M, h);
            for (i = 0;i < M;i++) {
                *(X + i) = *(D16 + i);
            }
        }
        else {
            fread(D, sizeof(int), M, h);
            for (i = 0;i < M;i++) {
                *(X + i) = *(D + i);
            }
        }
        fclose(h);

        //FFT_I(X,W,p);  MultConj(X,S,p); RFFT_I(X,W,p);
        for (j = 0;j < L;j++) {
            for (i = 0;i < N;i++) {
                *(W + j) += *(X + i + j) * *(S + i); //for(i=0;i<N;i++)*(X+i)/=N;
            }
        }

        for (i = 0;i < L;i++) {
            if ((B = fabs(*(W + i))) > C) {
                C = B;
                B = 32767. / C; // C-correlation
            }
        }

        for (i = 0;i < L;i++) {
            *(D16 + i) = (short)(*(W + i) * B);
        }

        B = C / A * a; // real amplituda

        sum = 0; sums = 0;
        for (i = b;i < L;i++) {
            sum += *(W + i);
            sums += *(W + i) * *(W + i); //b=1.5*L;
        }
        C = C / sqrt((sums - sum * sum / (L - b)) / (L - b - 1)); // SNR

#ifdef _WIN32
        strcpy(str, "_corr\\");
#else
        strcpy(str, "_corr/");
#endif
         
        strcat(str, "out");

        if ((h = fopen(str, "wb")) == NULL) {
            perror(" error open file ");
            exit(1);
        }
        fwrite(d, sizeof(short), 21u, h);
        fseek(h, 14u, SEEK_SET);
        fwrite(&B, sizeof(double), 1, h);
        fseek(h, 34u, SEEK_SET);
        fwrite(&L, sizeof(int), 1, h);
        st = 2; 
        c += 10;
        fwrite(&st, sizeof(short), 1, h); //write(h, &c, 1);
        fseek(h, 41u, SEEK_SET);
        fwrite(&c, sizeof(char), 1, h);
        //lseek(h, 42u, 0);
        if (fwrite(D16, sizeof(short), /*2 * */L, h) == -1) {
            perror(" error writing file "); // write data
            exit(1);
        }
        fclose(h);
        printf("OK\tA=%.2f\tSNR=%.1f", B, C);
        fprintf(ff, "OK\tA=%.2f\tSNR=%.1f", B, C);
        B = C = 0;
    }
    //free(S); free(W);

    free(X);
    free(S);
    free(W);
    free(D);
    free(D16);
    free(d);

    clock_t t_finish = clock();
    printf("\nprocessing time: %2.3f\n", (double)(t_finish - t_start) / CLOCKS_PER_SEC);
    //fprintf(ff, "\nprocessing time: %.2fs\n", (t_finish - t_start) / CLOCKS_PER_SEC);
    fclose(f);
    //fprintf(ff,"\n");
    fclose(ff);
    //system("C:\\windows\\notepad.exe corr.log");


    return 0;
}
